package common

import (
	"embed"
	"io/fs"
	"net/http"
	"os"

	"github.com/gin-contrib/static"
)

// Credit: https://github.com/gin-contrib/static/issues/19

type embedFileSystem struct {
	http.FileSystem
}

func (e *embedFileSystem) Exists(prefix string, path string) bool {
	_, err := e.Open(path)
	if err != nil {
		return false
	}
	return true
}

func (e *embedFileSystem) Open(name string) (http.File, error) {
	if name == "/" {
		// This will make sure the index page goes to NoRouter handler,
		// which will use the replaced index bytes with analytic codes.
		return nil, os.ErrNotExist
	}
	return e.FileSystem.Open(name)
}

func EmbedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	efs, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		panic(err)
	}
	return &embedFileSystem{
		FileSystem: http.FS(efs),
	}
}

// themeAwareFileSystem delegates to the appropriate embedded FS based on
// the current theme (via GetTheme). This enables runtime theme switching
// without restarting the server.
type themeAwareFileSystem struct {
	defaultFS static.ServeFileSystem
	classicFS static.ServeFileSystem
}

func (t *themeAwareFileSystem) Exists(prefix string, path string) bool {
	if GetTheme() == "classic" {
		return t.classicFS.Exists(prefix, path)
	}
	return t.defaultFS.Exists(prefix, path)
}

func (t *themeAwareFileSystem) Open(name string) (http.File, error) {
	if GetTheme() == "classic" {
		return t.classicFS.Open(name)
	}
	return t.defaultFS.Open(name)
}

func NewThemeAwareFS(defaultFS, classicFS static.ServeFileSystem) static.ServeFileSystem {
	return &themeAwareFileSystem{defaultFS: defaultFS, classicFS: classicFS}
}

// mergeFileSystem 依次尝试多个 FS，找到文件即返回。
// 用于合并 admin 和 user 的静态资源（JS/CSS/图片等），
// 各 SPA 的打包文件名含 hash，不存在冲突。
type mergeFileSystem struct {
	systems []static.ServeFileSystem
}

func (m *mergeFileSystem) Exists(prefix string, path string) bool {
	for _, fs := range m.systems {
		if fs.Exists(prefix, path) {
			return true
		}
	}
	return false
}

func (m *mergeFileSystem) Open(name string) (http.File, error) {
	if name == "/" {
		return nil, os.ErrNotExist
	}
	for _, fs := range m.systems {
		f, err := fs.Open(name)
		if err == nil {
			return f, nil
		}
	}
	return nil, os.ErrNotExist
}

func NewMergeFS(systems ...static.ServeFileSystem) static.ServeFileSystem {
	return &mergeFileSystem{systems: systems}
}

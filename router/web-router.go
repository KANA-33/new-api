package router

import (
	"embed"
	"net/http"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/controller"
	"github.com/QuantumNous/new-api/middleware"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

// ThemeAssets holds the embedded frontend assets for all themes.
type ThemeAssets struct {
	DefaultBuildFS   embed.FS
	DefaultIndexPage []byte
	ClassicBuildFS   embed.FS
	ClassicIndexPage []byte
	UserBuildFS      embed.FS
	UserIndexPage    []byte
}

func SetWebRouter(router *gin.Engine, assets ThemeAssets) {
	defaultFS := common.EmbedFolder(assets.DefaultBuildFS, "web/default/dist")
	userFS := common.EmbedFolder(assets.UserBuildFS, "web/user/dist")
	classicFS := common.EmbedFolder(assets.ClassicBuildFS, "web/classic/dist")

	mergedDefaultFS := common.NewMergeFS(defaultFS, userFS)
	themeFS := common.NewThemeAwareFS(mergedDefaultFS, classicFS)

	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(middleware.GlobalWebRateLimit())
	router.Use(middleware.Cache())
	router.Use(static.Serve("/", themeFS))
	router.NoRoute(func(c *gin.Context) {
		c.Set(middleware.RouteTagKey, "web")
		if strings.HasPrefix(c.Request.RequestURI, "/v1") || strings.HasPrefix(c.Request.RequestURI, "/api") || strings.HasPrefix(c.Request.RequestURI, "/assets") {
			controller.RelayNotFound(c)
			return
		}
		c.Header("Cache-Control", "no-cache")
		if common.GetTheme() == "classic" {
			c.Data(http.StatusOK, "text/html; charset=utf-8", assets.ClassicIndexPage)
			return
		}
		session := sessions.Default(c)
		role, _ := session.Get("role").(int)
		if role >= common.RoleAdminUser {
			c.Data(http.StatusOK, "text/html; charset=utf-8", assets.DefaultIndexPage)
		} else {
			c.Data(http.StatusOK, "text/html; charset=utf-8", assets.UserIndexPage)
		}
	})
}

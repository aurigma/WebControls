<%@ Page Language="C#" AutoEventWireup="true" %>

<html>
<head id="Head1" runat="server">
</head>
<body>
</body>
</html>
<script runat="server">
    private void Page_Load(System.Object sender, System.EventArgs e)
    {
        string strFileName = Request.QueryString["id"];

        switch (System.IO.Path.GetExtension(strFileName))
        {
            case ".png":
                Response.ContentType = "image/png";
                break;
            case ".gif":
                Response.ContentType = "image/gif";
                break;
            case ".jpg":
                Response.ContentType = "image/jpeg";
                break;
        }

        var file = Aurigma.GraphicsMill.AjaxControls.FileCache.GetInstance().GetAbsolutePublicCachePath(strFileName);
        if (System.IO.File.Exists(file))
        {
            Response.WriteFile(Aurigma.GraphicsMill.AjaxControls.FileCache.GetInstance().GetAbsolutePublicCachePath(strFileName));
        }
        else
        {
            Response.StatusCode = 404;
        }

        Response.End();
    }
</script>
# Graphics Mill Web Controls

## Description

Graphics Mill Web Controls is a front end for the Graphics Mill image processing library. This set of web controls allows viewing and editing graphics. You can use the Bitmap Viewer to display, zoom, crop, and apply different effects to bitmap images. AJAX Vector Objects allow viewing and editing composite images consisting of multiple elements such as bitmaps, texts, and vector data which can be used to build a rich image editing application like a business card or t-shirt editor.

## History

We introduced the Graphics Mill Web Controls library in 2007. Initially, we built the SDK on top of the ASP.NET Web Forms and ASP.NET 2.0 frameworks, which are outdated. Despite that, we continued to develop and maintain the library. On the other hand, we found that the learning curve of Graphics Mill Web Controls (especially its Vector Objects component) is very high, so several years ago we focused on Customer's Canvas - the ready online document editor. The Web Controls library turned into an essential part of Customer's Canvas. The breaking backward compatibility allowed us to continue developing of the SDK more actively.

Since that time, we had stopped active development of the Web Controls version included in the Graphics Mill SDK. To make sure that our customer still could support the existing code in long-term, we decided to publish the full source code of the Web Controls package on GitHub.

If you start a new project, we recommend considering the [Customer's Canvas](https://customerscanvas.com/) product, which allows building an online graphics editor more easily and which we implemented on top of the modern technology stack.

## Important notes

 - We continue to provide support for existing customers of Web Controls as long as their maintenance contract is active. If the maintenance contract of Graphics Mill is renewed after Nov 1, 2018, then we continue to provide support for Graphis Mill Core but not for Graphics Mill Web Controls.

 - Small fixes and pull requests are possible but not guaranteed.

 - We are not going to remove the existing required API in the Graphics Mill Core component, but we don't guarantee that further Core versions will be fully compatible with existing sources of Web Controls.

 - You still need a valid license for Graphics Mill Core to use Web Controls.

## How to build

Just build GraphicsMill.Web.sln.

The default target platform is x86. If you need x64, please replace the NuGet package manually.

## In this repository

- AjaxControls assembly.
- AjaxVectorObjects assembly.
- SVGObjects assembly.
- WebControl's Reference in XML format.
- [Svg.NET library](https://github.com/vvvv/SVG)
- [tar-cs library](https://code.google.com/archive/p/tar-cs/)

## Documentation

- [Graphics Mill Web Controls](https://www.graphicsmill.com/docs/gmwc/)
- [Graphics Mill Core](https://www.graphicsmill.com/docs/gm/)

## License

This repository is licensed with the [MIT](LICENSE) license.

## Copyright notices

- [Svg.NET library](Svg.NET/license.txt).
- [tar-cs library](tar-cs/COPYING).

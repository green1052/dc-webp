// ==UserScript==
// @name DC WebP
// @version 1.0.0
// @author green1052
// @description WebP 자동 변환, 이름 난독화
// @match https://gall.dcinside.com/board/write*
// @match https://gall.dcinside.com/*/board/write*
// @namespace DCWebP
// @run-at document-start
// @noframes
// @license GPLv3
// @grant unsafeWindow
// @require https://cdn.jsdelivr.net/npm/webp-converter-browser@latest/dist/index.min.js
// @downloadURL https://raw.githubusercontent.com/green1052/dc-webp/refs/heads/master/dc-webp.user.js
// @homepageURL https://github.com/green1052/dc-webp
// ==/UserScript==

window.addEventListener("load", () => {
    unsafeWindow.imageUploader = new Proxy(unsafeWindow.imageUploader, {
        async apply(target, thisArg, argArray) {
            if (!argArray[0].type.startsWith("image/") || argArray[0].type.endsWith("gif"))
                return Reflect.apply(target, thisArg, argArray);

            try {
                const image = await webpConverterBrowser.blobToWebP(argArray[0], {quality: 0.8});
                return Reflect.apply(target, thisArg, [
                    new File([image], `${(Math.random() + 1).toString(36).substring(5)}.webp`),
                    argArray[1]
                ]);
            } catch {
                return Reflect.apply(target, thisArg, argArray);
            }
        }
    });
});

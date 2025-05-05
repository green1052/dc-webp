// ==UserScript==
// @name DC WebP
// @namespace DC WebP
// @version 1.0.1
// @description WebP 자동 변환, 이름 난독화
// @icon https://www.google.com/s2/favicons?domain=dcinside.com
// @grant unsafeWindow
// @author green1052
// @homepageURL https://github.com/green1052/dc-webp
// @require https://cdn.jsdelivr.net/npm/webp-converter-browser@latest/dist/index.min.js
// @match https://gall.dcinside.com/board/write*
// @match https://gall.dcinside.com/*/board/write*
// @match https://gall.dcinside.com/board/modify*
// @match https://gall.dcinside.com/*/*/modify*
// @run-at document-start
// @noframes
// @updateURL https://raw.githubusercontent.com/green1052/dc-webp/refs/heads/master/dc-webp.user.js
// @downloadURL https://raw.githubusercontent.com/green1052/dc-webp/refs/heads/master/dc-webp.user.js
// @supportURL https://github.com/green1052/dc-webp/issues
// ==/UserScript==

window.addEventListener("load", () => {
    unsafeWindow.imageUploader = new Proxy(unsafeWindow.imageUploader, {
        async apply(target, thisArg, argArray) {
            if (!argArray[0].type.startsWith("image/") || argArray[0].type.endsWith("gif") || (await argArray[0].text()).includes("ANMF"))
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

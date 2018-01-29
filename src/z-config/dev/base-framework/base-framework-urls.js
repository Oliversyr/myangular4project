/**
 * base-framework路径映射
 */
devIncludeUrls({

    "api/orgm/app/list": { "mapUrl": "base-framework/apps.json", "server": "LS", "isUnion": false },
    "api/orgm/module/list-demos": { "mapUrl": "base-framework/menus-demos.json", "server": "LS", "isUnion": false },
    "base-framework/menus-demos.static.json": { "mapUrl": "", "server": "LS", "isUnion": false },
    "api/orgm/module/list-tb-system": { "mapUrl": "base-framework/menus-tb-system.json", "server": "LS", "isUnion": false },
    "api/orgm/module/list-fpf-new": { "mapUrl": "base-framework/menus-fpf-new.json", "server": "LS", "isUnion": false },
    "api/orgm/module/list-fpf": { "mapUrl": "base-framework/menus-fpf.json", "server": "LS", "isUnion": false },
    "api/orgm/module/list-acc-center": { "mapUrl": "base-framework/menus-acc-center.json", "server": "LS", "isUnion": false },
    "api/orgm/module/list-tb-storage": { "mapUrl": "base-framework/menus-tb-storage.json", "server": "LS", "isUnion": false },
    "base-framework/menus-tb-storage.static.json": { "mapUrl": "", "server": "LS", "isUnion": false },

    //文件服务器
    "hobby_fileserver/upload/uploadFile.html": { "mapUrl": "", "server": "RAP", "isUnion": true },
    "slic-editor/jsp/upload_json.jsp": { "mapUrl": "", "server": "RAP", "isUnion": true },

});
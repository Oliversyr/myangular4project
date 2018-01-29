/**
 * @author liurong
 * @create date 2017-12-01 10:55:02
 * @modify date 2017-12-01 10:55:02
 * @desc 应用实体
*/

export interface Application {
    /**
     * 应用ID
     */
    appid: string;
    /**
     * 应用名
     */
    appname: string;
    /**
     * 应用标题
     */
    apptitle: string;
    /**
     * logo
     */
    icon: string;
    /**
     * url
     */
    appurl: string;
    /**
     * 描述
     */
    description: string;
    /**
     * 打开方式 默认 _self
     * 1. _blank	在一个新的未命名的窗口载入文档
     * 2. _self	在相同的框架或窗口中载入目标文档
     * 3. _parent	把文档载入父窗口或包含了超链接引用的框架的框架集
     * 4. _top	把文档载入包含该超链接的窗口,取代任何当前正在窗口中显示的框架
     * 5. framename 在同一个 frame 框架中载入文档
     * 
     */
    target: string;

    /**
     * 版本号
     */
    appVersion: string;
}
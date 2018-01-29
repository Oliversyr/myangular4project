/**
 * @author liurong
 * @create date 2017-12-14 10:27:12
 * @modify date 2017-12-14 10:27:12
 * @desc  常用类、接口等
*/

/**
 * 自定义map
 * 
 * @export
 * @interface SuiMap
 * @template T 
 */
export interface SuiMap<T> {
    [key: string]: T;
}

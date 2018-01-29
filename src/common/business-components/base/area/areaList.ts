import * as area from './area/area.json';

declare let require: any;

function getChildrenFun(obj) {
    let // 顶级分类(一级分类)的值
        firstLeaveId = obj.value,
        // 类似直辖市级别的 北京 天津 上海 重庆 香港 澳门
        municipalityArr = ['110000', '120000', '310000', '500000', '810000', '820000'],
        // firstLeaveId 在 municipalityArr 的下标位置
        municipalitySubIndex = municipalityArr.indexOf(firstLeaveId),
        // 根据区的id获取街道信息
        getStreetList = function (districtId) {
            return new Promise((resolve, reject) => {
                try {
                    let getData = require('./town/' + districtId + '.json');
                    let streetList = {
                        data: getData
                    };
                    resolve(streetList);
                }
                catch (err) {
                    reject(err);
                }
            })
        };
    if (municipalitySubIndex !== -1) {
        for (let item in area) {
            let _itemId = +item.substring(0, 4),
                _districtId = +municipalityArr[municipalitySubIndex].substring(0, 4) + 1;
            if (_itemId === _districtId) {
                getStreetList(item).then((res: any) => {
                    let streetObj = res.data,
                        districtObj = { value: item, label: area[item], children: [] };
                    for (let id in streetObj) {
                        districtObj.children.push({ value: id, label: streetObj[id] })
                    }
                    obj.children.push(districtObj);
                }).catch(() => {
                    let districtObj = { value: item, label: area[item] };
                    obj.children.push(districtObj);
                })
            }
        }
    }
    else {
        let provinceId = obj.value.substring(0, 2);
        for (let item in area) {
            let _provinceId = item.substring(0, 2),
                _provinceCityId = item.substring(0, 4),
                _noProvinceFlag = item.indexOf('0000') === -1,
                _noDistrictId = item.substring(4, 6);
            if (_provinceId === provinceId && _noDistrictId == '00' && _noProvinceFlag) {
                let cityObj = { value: item, label: area[item], children: [] };
                for (let item in area) {
                    if (item.substring(0, 4) == _provinceCityId && item.indexOf('00') === -1 && item.indexOf('0000') === -1) {
                        getStreetList(item).then((res: any) => {
                            let streetObj = res.data,
                                districtObj = { value: item, label: area[item], children: [] };
                            for (let id in streetObj) {
                                districtObj.children.push({ value: id, label: streetObj[id] })
                            }
                            cityObj.children.push(districtObj);
                        }).catch(() => {
                            let districtObj = { value: item, label: area[item] };
                            cityObj.children.push(districtObj);
                        })
                    }
                }
                obj.children.push(cityObj);
            }
        }
    }
}

export function getAreaList() {
    let list = [];
    for (let id in area) {
        if (id.indexOf('0000') !== -1) {
            let obj = { value: id, label: area[id], children: [] };
            list.push(obj);
        }
    }

    for (var key in list) {
        getChildrenFun(list[key]);
    }

    return list;
}

import { CommonServices } from './../services/groups/common-services.module';
import { Pipe, PipeTransform, NgModule } from '@angular/core';


/*
 *  数字格式化; 四舍五入方式
 * Usage:
 *   _value | suiNum[:format,:defualtValue]
 * defualtValue: 默认值;如果value为空 则显示默认值
 * Example:
 * 1. {{ 1 | suiNum: '#,##0.00' }}
 *   1.00
*/
@Pipe({name: 'suiNum', pure: true})
export class SuiNumPipe implements PipeTransform {

  constructor(
    protected utils: CommonServices
  ){

  }

  transform(value: number|string, mask: string, defualtValue?: any) {

      if(this.utils.classUtil.isNum(defualtValue) && !this.utils.classUtil.isNum(value)) {
        //使用默认值
          value = defualtValue ;
      }

      if ( !mask || !this.utils.classUtil.isNum(value)) {
        return value; // return as it is.
      }

      let _value: any = value ;
      let _mask: any = mask ;

      var isNegative, result, decimal, group, posLeadZero, posTrailZero, posSeparator,
        part, szSep, integer,

        // find prefix/suffix
        len = _mask.length,
        start = _mask.search( /[0-9\-\+#]/ ),
        prefix = start > 0 ? _mask.substring( 0, start ) : '',
        // reverse string: not an ideal method if there are surrogate pairs
        str = _mask.split( '' ).reverse().join( '' ),
        end = str.search( /[0-9\-\+#]/ ),
        offset = len - end,
        substr = _mask.substring( offset, offset + 1 ),
        indx = offset + ( ( substr === '.' || ( substr === ',' )) ? 1 : 0 ),
        suffix = end > 0 ? _mask.substring( indx, len ) : '';

      // _mask with prefix & suffix removed
      _mask = _mask.substring( start, indx );

      // convert any string to number according to formation sign.
      _value = _mask.charAt( 0 ) === '-' ? -_value : +_value;
      isNegative = _value < 0 ? _value = -_value : 0; // process only abs(), and turn on flag.

      // search for separator for grp & decimal, anything not digit, not +/- sign, not #.
      result = _mask.match( /[^\d\-\+#]/g );
      decimal = ( result && result[ result.length - 1 ] ) || '.'; // treat the right most symbol as decimal
      group = ( result && result[ 1 ] && result[ 0 ] ) || ',';  // treat the left most symbol as group separator

      // split the decimal for the format string if any.
      _mask = _mask.split( decimal );
      // Fix the decimal first, toFixed will auto fill trailing zero.
      _value = _value.toFixed( _mask[ 1 ] && _mask[ 1 ].length );
      _value = +( _value ) + ''; // convert number to string to trim off *all* trailing decimal zero(es)

      // fill back any trailing zero according to format
      posTrailZero = _mask[ 1 ] && _mask[ 1 ].lastIndexOf( '0' ); // look for last zero in format
      part = _value.split( '.' );
      // integer will get !part[1]
      if ( !part[ 1 ] || ( part[ 1 ] && part[ 1 ].length <= posTrailZero ) ) {
        _value = ( +_value ).toFixed( posTrailZero + 1 );
      }
      szSep = _mask[ 0 ].split( group ); // look for separator
      _mask[ 0 ] = szSep.join( '' ); // join back without separator for counting the pos of any leading 0.

      posLeadZero = _mask[ 0 ] && _mask[ 0 ].indexOf( '0' );
      if ( posLeadZero > -1 ) {
        while ( part[ 0 ].length < ( _mask[ 0 ].length - posLeadZero ) ) {
          part[ 0 ] = '0' + part[ 0 ];
        }
      } else if ( +part[ 0 ] === 0 ) {
        part[ 0 ] = '';
      }

      _value = _value.split( '.' );
      _value[ 0 ] = part[ 0 ];

      // process the first group separator from decimal (.) only, the rest ignore.
      // get the length of the last slice of split result.
      posSeparator = ( szSep[ 1 ] && szSep[ szSep.length - 1 ].length );
      if ( posSeparator ) {
        integer = _value[ 0 ];
        str = '';
        offset = integer.length % posSeparator;
        len = integer.length;
        for ( indx = 0; indx < len; indx++ ) {
          str += integer.charAt( indx ); // ie6 only support charAt for sz.
          // -posSeparator so that won't trail separator on full length
          /*jshint -W018 */
          if ( !( ( indx - offset + 1 ) % posSeparator ) && indx < len - posSeparator ) {
            str += group;
          }
        }
        _value[ 0 ] = str;
      }
      _value[ 1 ] = ( _mask[ 1 ] && _value[ 1 ] ) ? decimal + _value[ 1 ] : '';

      // remove negative sign if result is zero
      result = _value.join( '' );
      if ( result === '0' || result === '' ) {
        // remove negative sign if result is zero
        isNegative = false;
      }

      // put back any negation, combine integer and fraction, and add back prefix & suffix
      return prefix + ( ( isNegative ? '-' : '' ) + result ) + suffix;
  }
}

/*
 *  数字格式化; 舍尾 
 * 例如 1.9999999999999 两位小数位: 1.99
 * Usage:
 *   _value | number[:format,:defualtValue]
 * defualtValue: 默认值;如果value为空 则显示默认值
 * Example:
 * 1. {{ 1.9999 | number: '#,##0.00' }}
 *   1.99
*/
@Pipe({name: 'numberEndOffTail', pure: true})
export class NumberEndOffTailPipe extends SuiNumPipe {

  
  transform(value: number|string, mask: string, defualtValue?: any) {
    if(this.utils.classUtil.isNum(defualtValue) && !this.utils.classUtil.isNum(value+"")) {
      //使用默认值
        value = defualtValue ;
    }
    let formatReg = /\.(.*)/; 

    let reulst = formatReg.exec(mask);
    let precision = 0 ;
    if(reulst != null) {
      precision = reulst[1].length;
    }

    let _value = this.utils.classUtil.numberEndOffTail(value,precision);
    // console.debug(">>>>value, _value, mask, defualtValue",value, _value, mask, defualtValue);
    return super.transform(_value, mask, defualtValue);
  }
}


@NgModule({
  imports: [ 
    
   ],
  exports: [ 
    SuiNumPipe, 
    NumberEndOffTailPipe, 
  ],
  declarations: [ 
    SuiNumPipe, 
    NumberEndOffTailPipe, 
  ]
})
export class SuiNumberPipeModule { }
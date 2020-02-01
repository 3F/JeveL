/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2020  Denis Kuzmin < x-3F@outlook.com > GitHub/3F
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*/

import { IJeveLConfig } from './IJeveLConfig'
import { DataFormat } from './DataFormat';

export class JeveLConfig implements IJeveLConfig
{
    /**
     * Actual format for new handlers.
     */
    public format: DataFormat = DataFormat.Default;

    /**
     * Use this default event when it's omitted from list.
     * ie. when `defaultEvent` will contain an `click` value:
     *
     * (Contract-based format)
     *   `name` will equal to `name:click`
     *   `name:;keyup` will equal to `name:click;keyup`
     *   etc.
     * 
     * (Event-type-based format)
     *   `name` will equal to `name:click`
     *   `name;name2:keyup` will equal to `name:click;name2:keyup`
     *   etc.
     * 
     */
    public defaultEvent: string = 'click';
    
    /**
     * Attribute name to use as list of actions.
     * ie. `jvl` in <div class="btn-act" jvl="..."></div>
     */
    public attr: string = 'jvl';
    
    /**
     * Use specific delimiter for the action blocks.
     * ie. `;` in:
     *
     * (Contract-based format)
     *  name:event;event2;event3;... 
     *  ..........^......^......^
     *
     * (Event-type-based format)
     *  name:event;name2:event2;...  
     * ...........^............^
     */
    public delimAction: string = ';';

    /**
     * Use specific delimiter for the event blocks.
     * ie. `:` in:
     *
     * (Contract-based format)
     *  name:event;event2;event3;...
     *  ....^
     *
     * (Event-type-based format)
     *  name:event;name2:event2;...
     *  ....^...........^
     */
    public delimEvent: string = ':';

    /**
     * @param attr Overrides an `attr` if presented.
     * @param defaultEvent Overrides an `defaultEvent` if presented.
     * @returns Cloned IJeveLConfig
     */
    public Clone(attr?: string, defaultEvent?: string): IJeveLConfig
    {
        return <IJeveLConfig>
        {
            attr:           attr || this.attr,
            defaultEvent:   defaultEvent || this.defaultEvent,
            delimAction:    this.delimAction,
            delimEvent:     this.delimEvent,
            format:         this.format,
        };
    }
    
    /**
     * @param attr Attribute name to use as list of actions.
     * @param defaultEvent Use this default event when it's omitted from list.
     */
    public static getInstance(attr: string, defaultEvent?: string): IJeveLConfig;

    /**
     * @param config Existing config.
     */
    public static getInstance(config: IJeveLConfig): IJeveLConfig;
    
    public static getInstance(config?: any, defaultEvent?: string): IJeveLConfig
    {
        if(!config) {
            return new JeveLConfig();
        }
        return (typeof config === 'string') ?
                new JeveLConfig(config, defaultEvent) : config;
    }
    
    /**
     * @param attr Attribute name to use as list of actions.
     * @param defaultEvent Use this default event when it's omitted from list.
     */
    public constructor(attr?: string, defaultEvent?: string)
    {
        if(attr) {
            this.attr = attr;
        }

        if(defaultEvent) {
            this.defaultEvent = defaultEvent;
        }
    }
}
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

import { DataFormat } from "./DataFormat";

export interface IJeveLConfig
{
    /**
     * Actual format for new handlers.
     */
    format: DataFormat;

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
    defaultEvent: string;

    /**
     * Attribute name to use as list of actions.
     * ie. `jvl` in <div class="btn-act" jvl="..."></div>
     */
    attr: string;

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
    delimAction: string;

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
    delimEvent: string;

    /**
     * @param attr Overrides an `attr` if presented.
     * @param defaultEvent Overrides an `defaultEvent` if presented.
     * @returns Cloned IJeveLConfig
     */
    Clone(attr?: string, defaultEvent?: string): IJeveLConfig;
}
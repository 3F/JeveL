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

import { IParser } from "./IParser";
import { IJeveL } from "./IJeveL";
import { IJeveLConfig } from "./IJeveLConfig";
import { IList } from "./IList";
import { IHandler } from "./IHandler";

export class EventTypeParser implements IParser
{
    protected jvl: IJeveL;

    /**
     * Event-type-based format: name:type;name2:type2;...
     * default event type:
     *  ~ name   == name:default*
     *  ~ name:  == name:default*
     *  ~ name:; == name:default*;
     *  ~ name;name2:keyup == name:default*;name2:keyup
     * 
     * @param raw Raw configuration of the new handlers.
     * @param cfg Actual configuration.
     * @param target
     * @returns Returns prepared list of handlers.
     */
    public extract(raw: string, cfg: IJeveLConfig, target: Element): IList<IHandler>
    {
        const ret: IList<IHandler> = [];
        
        let pos     = 0;
        let prev    = 0;
        
        do
        {
            pos = raw.indexOf(cfg.delimAction, prev);

            const act   = (pos < 0) ? undefined : pos;
            const eraw  = raw.slice(prev, act);
            const epos  = eraw.indexOf(cfg.delimEvent);

            let name;
            let etype;

            if(epos < 0)
            {
                name    = eraw;
                etype   = cfg.defaultEvent;
            }
            else
            {
                name    = eraw.slice(0, epos);
                etype   = eraw.slice(epos + 1);
            }

            const h = <IHandler>
            { 
                name:   name.trim(),
                etype:  etype.trim(),
                target: target,
                cfg:    cfg,
                jvl:    this.jvl,
            };
            
            if(!h.etype || !h.name)
            {
                console.error(
                    'name or its event type cannot be empty for new handler. target:', 
                    h.target, h
                );
            }
            else {
                ret.push(h);
            }
            
            if(act == undefined) {
                break;
            }
            prev = ++pos;
        }
        while(pos < raw.length);

        return ret;
    }

    public constructor(jvl: IJeveL)
    {
        this.jvl = jvl;
    }
}

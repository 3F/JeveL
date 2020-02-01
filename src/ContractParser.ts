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
import { IDictionary } from "./IDictionary";

export class ContractParser implements IParser
{
    protected jvl: IJeveL;

    /**
     * Contract-based format: name:type1;type2;type3
     * default event type:
     *  ~ name   == name:default*
     *  ~ name:  == name:default*
     *  ~ name:; == name:default*
     *  ~ name:type1; == name:type1
     *  ~ name:;type1;type2 == name:default*;type1;type2
     * 
     * @param raw Raw configuration of the new handlers.
     * @param cfg Actual configuration.
     * @param target
     * @returns Returns prepared list of handlers.
     */
    public extract(raw: string, cfg: IJeveLConfig, target: Element): IList<IHandler>
    {
        const _newh = (name: string, etype: string) => <IHandler>
        { 
            name:   name,
            etype:  etype,
            target: target,
            cfg:    cfg,
            jvl:    this.jvl,
        };

        let pos = raw.indexOf(cfg.delimEvent);
        if(pos < 0) {
            return [ _newh(raw.trim(), cfg.defaultEvent) ];
        }
        
        const ret: IList<IHandler> = [];
        const dup: IDictionary<boolean> = {};

        const name  = raw.slice(0, pos).trim();
        let prev    = ++pos;
        do
        {
            pos = raw.indexOf(cfg.delimAction, prev);

            const act   = (pos < 0) ? undefined : pos;
            const etype = raw.slice(prev, act).trim();

            if(act == undefined && !etype) {
                break; // name:type1;type2; <- we'll skip latest because of possible misunderstanding
                       // name:; <- +default*
                       // name:type1;;type3 <- +default*
            }

            const t = etype || cfg.defaultEvent;
            if(dup[t]) {
                console.warn('ignored duplicate of event: ', t);
            }
            else
            {
                dup[t] = true;
                ret.push(_newh(name, t));
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

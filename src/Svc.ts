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

import { IHandler } from "./IHandler";
import { IJeveLConfig } from "./IJeveLConfig";
import { IJeveL } from "./IJeveL";
import { IList } from "./IList";
import { FAct } from "./FAct";
import { DataFormat } from "./DataFormat";
import { IDictionary } from "./IDictionary";
import { IParser } from "./IParser";
import { ContractParser } from "./ContractParser";
import { EventTypeParser } from "./EventTypeParser";

export class Svc
{
    protected parsers: IDictionary<IParser> = {};

    protected jvl: IJeveL;
    
    public find(cfg: IJeveLConfig, cb: (h: IList<IHandler>) => void): void
    {
        const parser: IParser = this.getParser(cfg);

        const elems = document.querySelectorAll("*[" + cfg.attr + "]");
        for(let i = 0; i < elems.length; ++i)
        {
            const raw = elems[i].getAttribute(cfg.attr);
            if(raw) {
                cb(parser.extract(raw, cfg, elems[i]));
            }
        }
    }
    
    public subscribe(h: IHandler, act: FAct)
    {
        if(!this.isValid(h)) {
            console.warn('handler is not valid for sub:', h);
            return;
        }

        if(!h.listener) {
            h.listener = [];
        }

        const l = this.prepareListener(h, act);
        
        h.listener.push(l);
        h.activated = true;
        
        this.attach(h, l);
        h.attached  = true;
    }

    public unsubscribe(h: IHandler)
    {
        if(!this.isValid(h))
        {
            console.warn('handler is not valid for unsub:', h);
            return;
        }
        h.activated = false;
        
        for(let k in h.listener)
        {
            this.detach(h, h.listener[k]);
            delete h.listener[k];
        }
        h.listener.length = 0; // an empty slots to zero

        h.attached = false;
    }

    public constructor(jvl: IJeveL)
    {
        this.jvl = jvl;
    }

    protected prepareListener(h: IHandler, act: FAct): EventListener
    {
        return (e: Event) => h.activated && act(e, h);
    }

    protected attach(h: IHandler, cb: EventListener): void
    {
        if(h.target.addEventListener) {
            h.target.addEventListener(h.etype, cb, false);
            return;
        }
        
        // IE
        if((<any>h.target).attachEvent) {
            (<any>h.target).attachEvent('on' + h.etype, cb);
            return;
        }

        throw new Error('Unsupported event system for attaching handler.');
    }

    protected detach(h: IHandler, cb: EventListener): void
    {
        if(h.target.removeEventListener) {
            h.target.removeEventListener(h.etype, cb, false);
            return;
        }
        
        // IE
        if((<any>h.target).detachEvent) {
            (<any>h.target).detachEvent('on' + h.etype, cb);
            return;
        }

        throw new Error('Unsupported event system for detaching handler.');
    }
    
    protected getParser(cfg: IJeveLConfig): IParser
    {
        switch(cfg.format)
        {
            case DataFormat.ContractBased:
            {
                if(!this.parsers[cfg.format]) {
                    this.parsers[cfg.format] = new ContractParser(this.jvl);
                }
                return this.parsers[cfg.format];
            }

            case DataFormat.EventTypeBased:
            {
                if(!this.parsers[cfg.format]) {
                    this.parsers[cfg.format] = new EventTypeParser(this.jvl);
                }
                return this.parsers[cfg.format];
            }
        }
        throw new Error("Can't find related parser for: " + cfg.format);
    }

    private isValid(h: IHandler): boolean
    {
        return (h && h.etype && h.target) ? true : false;
    }
}
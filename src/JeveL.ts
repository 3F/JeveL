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

import { IJeveL } from './IJeveL'
import { IJeveLConfig } from './IJeveLConfig';
import { JeveLConfig } from './JeveLConfig';
import { FAct } from './FAct';
import { Svc } from './Svc';
import { IDictionary } from './IDictionary';
import { IHandler } from './IHandler';
import { IList } from './IList';
import { DataFormat } from './DataFormat';

export class JeveL implements IJeveL
{
    public config: IJeveLConfig;

    protected handlers: IDictionary<IHandler> = {};

    protected svc: Svc = new Svc(this);

    /**
     * Attaches handlers for all configured attributes.
     * - It will use configuration by default with overriding values from current arguments.
     * - It can be invoked multiple times just to attach new attributes.
     *   ie. Attached handlers will be ignored.
     * 
     * @param attr Attribute name to use as list of actions. Or from config.
     * @param defaultEvent Use this default event when it's omitted from list. Or from config.
     * @returns Returns `IJeveL` instance to continue chain.
     */
    public attach(attr?: string, defaultEvent?: string): IJeveL
    {
        const cfg = this.config.Clone(attr, defaultEvent);

        this.svc.find(cfg, (h: IList<IHandler>) =>
        {
            for(let k in h)
            {
                const id = this.getId(h[k]);

                if(!this.handlers[id]) {
                    this.handlers[id] = h[k];
                }
            }
        });
        
        return this;
    }

    /**
     * Detaches all configured handlers from selected attributes.
     * - It will use configuration by default with overriding values from current arguments.
     * - It can be invoked multiple times just to detach other attributes.
     *   ie. Detached handlers will be ignored.
     * 
     * @param dom Set as true to rescan DOM nodes in addition for already initialized storage.
     * @param attr Attribute name where configured list of actions. Or from config.
     * @returns Returns `IJeveL` instance to continue chain.
     */
    public detach(dom?: boolean, attr?: string): IJeveL
    {
        for(let k in this.handlers)
        {
            this.svc.unsubscribe(this.handlers[k]);
            delete this.handlers[k];
        }
        
        if(!dom) {
            return this;
        }

        const _attr = attr || this.config.attr;

        this.svc.find(this.config.Clone(_attr), (h: IList<IHandler>) =>
        {
            for(let k in h) {
                this.svc.unsubscribe(h[k]);
            }
        });
        
        return this;
    }

    /**
     * To check breach of contract. Minimal coverage.
     * Validates initial declaration from view data and final implementation via any model.
     *
     * @param useException Will throw exception instead of boolean result if true (by default).
     * @returns False if one or more handlers does not contain any listeners. Otherwise true.
     * @exception
     */
    public validate(useException: boolean = true): boolean
    {
        for(let k in this.handlers)
        {
            let l = this.handlers[k].listener;
            
            if(l && l.length > 0) {
                continue;
            }

            if(!useException) {
                return false;
            }

            const h = this.handlers[k];
            console.log("Breach of obligations under: '"+  h.name +"'("+ h.etype +" event)", h);

            throw new Error("The attached contract from the view data is not fulfilled by your model implementation.");
        }
        return true;
    }

    /**
     * Activates specified handler by its name.
     * And/or adds new logic for this handler.
     * @param name Handler name.
     * @param act New logic for this handler.
     * @returns Returns `IJeveL` instance to continue chain.
     */
    public on(name: string, act?: FAct): IJeveL;

    /**
     * Activates specified handler by its name.
     * And/or adds new logic for this handler.
     * 
     * @param name Handler name.
     * @param etype To cover its specific event type: https://developer.mozilla.org/en-US/docs/Web/Events
     * @param act New logic for this handler.
     * @returns Returns `IJeveL` instance to continue chain.
     */
    public on(name: string, etype: string, act?: FAct): IJeveL;
    
    public on(name: string, actOrType: any, act?: FAct): IJeveL
    {
        let etype;
        if(typeof actOrType === 'string') {
            etype = actOrType || this.config.defaultEvent;
        }
        else {
            etype   = this.config.defaultEvent;
            act     = actOrType;
        }

        const h = this.getHandler(name, etype);
        if(!h) {
            console.warn("Can't find handler. Check this in your view data: " + name, etype);
            return this;
        }
        
        if(!act) {
            h.activated = true;
            return this;
        }

        this.svc.subscribe(h, act);
        return this;
    }

    /**
     * Deactivates specified handler by its name.
     * Only deactivated handler can be activated again with `on()`.
     * @param name Handler name.
     * @param detach Detaching if true. Deactivating if false.
     * @returns Returns `IJeveL` instance to continue chain.
     */
    public off(name: string, detach?: boolean): IJeveL;
    
    /**
     * Deactivates specified handler by its name.
     * Only deactivated handler can be activated again with `on()`.
     *
     * @param name Handler name.
     * @param etype Its event type: https://developer.mozilla.org/en-US/docs/Web/Events
     * @param detach Detaching if true. Deactivating if false.
     * @returns Returns `IJeveL` instance to continue chain.
     */
    public off(name: string, etype: string, detach?: boolean): IJeveL;
    
    public off(name: string, detachOrType: any, detach?: boolean): IJeveL
    {
        let etype;
        if(typeof detachOrType === 'string') {
            etype = detachOrType || this.config.defaultEvent;
        }
        else {
            etype   = this.config.defaultEvent;
            detach  = detachOrType;
        }
        
        const h = this.getHandler(name, etype);
        if(!h) {
            return this;
        }

        h.activated = false;

        if(detach) {
            this.svc.unsubscribe(h);
        }
        return this;
    }

    /**
     * @param name Handler name.
     * @param etype Its event type. Optional for Event-type-based format.
     * @returns Returns true if found handler is attached now.
     */
    public isAttached(name: string, etype?: string): boolean
    {
        const h = this.getHandler(name, etype);
        return !h ? false : h.attached;
    }

    /**
     * @param name Handler name.
     * @param etype Its event type. Optional for Event-type-based format.
     * @returns Returns true if found handler is activated now.
     */
    public isActivated(name: string, etype?: string): boolean
    {
        const h = this.getHandler(name, etype);
        return !h ? false : h.activated;
    }

    /**
     * @param name Handler name.
     * @param etype Its event type. Optional for Event-type-based format.
     * @returns Returns true if found handler has one or more listeners.
     */
    public hasListeners(name: string, etype?: string): boolean
    {
        const h = this.getHandler(name, etype);
        return !h || !h.listener ? false : h.listener.length > 0;
    }

    /**
     * @param attr Attribute name to use as list of actions.
     * @param defaultEvent Use this default event when it's omitted from list.
     */
    public constructor(attr: string, defaultEvent?: string);

    /**
     * @param config Initialize with `IJeveLConfig` configuration.
     */
    public constructor(config: IJeveLConfig);

    public constructor();
    public constructor(config?: any, defaultEvent?: string)
    {
        this.config = JeveLConfig.getInstance(config, defaultEvent);
    }

    protected getId(h: IHandler): string
    {
        return this.getid(h.name, h.etype);
    }

    protected getid(name: string, etype?: string): string
    {
        if(!etype) {
            return name;
        }

        switch(this.config.format) {
            case DataFormat.EventTypeBased: return name;
        }
        return name + etype;
    }

    private getHandler(name: string, etype?: string): IHandler
    {
        return this.handlers[this.getid(name, etype)];
    }
}

(<any>window)['JeveL'] = JeveL;
(<any>window)['DataFormat'] = DataFormat;
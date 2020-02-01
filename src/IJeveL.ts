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

import { FAct } from "./FAct";

export interface IJeveL
{
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
    attach(attr?: string, defaultEvent?: string): IJeveL;

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
    detach(dom?: boolean, attr?: string): IJeveL;

    /**
     * To check breach of contract. Minimal coverage.
     * Validates initial declaration from view data and final implementation via any model.
     *
     * @param useException Will throw exception instead of boolean result if true (by default).
     * @returns False if one or more handlers does not contain any listeners. Otherwise true.
     * @exception
     */
    validate(useException: boolean): boolean;
    
    /**
     * Activates specified handler by its name.
     * And/or adds new logic for this handler.
     *
     * @param name Handler name.
     * @param act New logic for this handler.
     * @returns Returns `IJeveL` instance to continue chain.
     */
    on(name: string, act?: FAct): IJeveL;

    /**
     * Activates specified handler by its name.
     * And/or adds new logic for this handler.
     * 
     * @param name Handler name.
     * @param etype To cover its specific event type: https://developer.mozilla.org/en-US/docs/Web/Events
     * @param act New logic for this handler.
     * @returns Returns `IJeveL` instance to continue chain.
     */
    on(name: string, etype: string, act?: FAct): IJeveL;

    /**
     * Deactivates specified handler by its name.
     * Only deactivated handler can be activated again with `on()`.
     *
     * @param name Handler name.
     * @param detach Detaching if true. Deactivating if false.
     * @returns Returns `IJeveL` instance to continue chain.
     */
    off(name: string, detach?: boolean): IJeveL;

    /**
     * Deactivates specified handler by its name.
     * Only deactivated handler can be activated again with `on()`.
     *
     * @param name Handler name.
     * @param etype Its event type: https://developer.mozilla.org/en-US/docs/Web/Events
     * @param detach Detaching if true. Deactivating if false.
     * @returns Returns `IJeveL` instance to continue chain.
     */
    off(name: string, etype: string, detach?: boolean): IJeveL;

    /**
     * @param name Handler name.
     * @param etype Its event type. Optional for Event-type-based format.
     * @returns Returns true if found handler is attached now.
     */
    isAttached(name: string, etype?: string): boolean;

    /**
     * @param name Handler name.
     * @param etype Its event type. Optional for Event-type-based format.
     * @returns Returns true if found handler is activated now.
     */
    isActivated(name: string, etype?: string): boolean;

    /**
     * @param name Handler name.
     * @param etype Its event type. Optional for Event-type-based format.
     * @returns Returns true if found handler has one or more listeners.
     */
    hasListeners(name: string, etype?: string): boolean;
}
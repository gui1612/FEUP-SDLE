import { expect, test, suite } from 'vitest'
import { EWFlag } from '../../lib/crdts/EWFlag'

suite("EWFlag", () => {
    
        test('constructor', () => {
            expect(new EWFlag('A')).toBeInstanceOf(EWFlag)
        })
    
        test('enable', () => {
            const ewf = new EWFlag('A')
            expect(ewf.enable()).toEqual(new Set([true]))
        })
    
        test('disable', () => {
            const ewf = new EWFlag('A')
            expect(ewf.disable()).toEqual(new Set([false]))
        })
    
        test('merge', () => {
            const ewf = new EWFlag('A')
            ewf.enable()
            expect(ewf.values).toEqual(new Set([true]))
    
            const ewf2 = new EWFlag('B')
            ewf2.disable()
            expect(ewf2.values).toEqual(new Set([false]))
    
            ewf.merge(ewf2)
            expect(ewf.values).toEqual(new Set([true, false]))
        })
    
        test('reset', () => {
            const ewf = new EWFlag('A')
            ewf.enable()
            expect(ewf.values).toEqual(new Set([true]))
    
            ewf.reset()
            expect(ewf.values).toEqual(new Set([]))
        })
})

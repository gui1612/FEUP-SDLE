import { expect, test, suite } from 'vitest'
import { EWFlag } from '../../lib/crdts/EWFlag'

suite("EWFlag", () => {
    
        test('constructor', () => {
            expect(new EWFlag('A')).toBeInstanceOf(EWFlag)
        })
    
        test('enable', () => {
            const ewf = new EWFlag('A')
            expect(ewf.enable()).toEqual(true)
        })
    
        test('disable', () => {
            const ewf = new EWFlag('A')
            expect(ewf.disable()).toEqual(false)
        })
    
        test('merge', () => {
            const ewf = new EWFlag('A')
            ewf.enable()
            expect(ewf.value).toEqual(true)
    
            const ewf2 = new EWFlag('B')
            ewf2.disable()
            expect(ewf2.value).toEqual(false)
    
            ewf.merge(ewf2)
            expect(ewf.value).toEqual(true)
        })
    
        test('reset', () => {
            const ewf = new EWFlag('A')
            ewf.enable()
            expect(ewf.value).toEqual(true)
    
            ewf.reset()
            expect(ewf.value).toEqual(false)
        })
})

import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, Flip, Observer)

export { gsap, Flip, Observer, ScrollTrigger }

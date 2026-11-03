import { useEffect } from 'react'
import Stage from './components/Stage'
import { Preloader, HUD, Cursor } from './components/Chrome'
import { initDirector } from './engine/director'
import { HeroBack, HeroFront } from './scenes/Hero'
import { AboutBack, AboutFront } from './scenes/About'
import { WorkBack, WorkFront } from './scenes/Work'
import { JourneyBack, JourneyFront } from './scenes/Journey'
import { Orbit, SkillsBack, SkillsFront, SkillsMain } from './scenes/Skills'
import { AwardsFront } from './scenes/Awards'
import { ContactBack, ContactFront } from './scenes/Contact'

export default function App() {
  useEffect(() => initDirector(), [])
  return (
    <>
      <div className="layer-back"><AboutBack /><WorkBack /><JourneyBack /><SkillsBack /><HeroBack /><ContactBack /></div>
      <Stage />
      <div className="layer-front"><SkillsFront /></div>
      <Orbit />
      <main><HeroFront /><AboutFront /><WorkFront /><JourneyFront /><SkillsMain /><AwardsFront /><ContactFront /></main>
      <HUD /><Cursor /><Preloader />
    </>
  )
}

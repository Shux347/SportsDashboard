import { createEvents, EventAttributes } from 'ics'
import { Fixture } from '../types/fixture'

function fixtureToEventAttributes(fixture: Fixture): EventAttributes {
  const d = new Date(fixture.utcDate)
  return {
    title: fixture.eventName,
    start: [
      d.getUTCFullYear(),
      d.getUTCMonth() + 1,
      d.getUTCDate(),
      d.getUTCHours(),
      d.getUTCMinutes(),
    ],
    startInputType: 'utc',
    duration: { hours: 2 },
  }
}

function downloadIcs(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function useCalendarExport() {
  const exportFixture = (fixture: Fixture): void => {
    const { error, value } = createEvents([fixtureToEventAttributes(fixture)])
    if (error || !value) {
      console.error('Failed to create ICS event:', error)
      return
    }
    downloadIcs(value, `${fixture.eventName}.ics`)
  }

  const exportFixtures = (fixtures: Fixture[]): void => {
    const events = fixtures.map(fixtureToEventAttributes)
    const { error, value } = createEvents(events)
    if (error || !value) {
      console.error('Failed to create ICS events:', error)
      return
    }
    downloadIcs(value, 'sport-fixtures.ics')
  }

  return { exportFixture, exportFixtures }
}

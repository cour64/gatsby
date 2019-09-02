jest.mock(`ci-info`)
describe(`CI detection`, () => {
  const origEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...origEnv }
  })

  afterEach(() => {
    process.env = origEnv
    console.log(`reset env`, process.env)
  })

  it(`Detects CI when ci-info detects one`, () => {
    const ciInfo = require(`ci-info`)
    ciInfo.setIsCI(true)
    ciInfo.setName(`testname`)

    const { isCI, getCIName } = require(`../ci`)
    expect(isCI()).toBeTruthy()
    expect(getCIName()).toEqual(`testname`)
  })

  it(`Detects Now v2`, () => {
    process.env.NOW_BUILDER_ANNOTATE = 1
    const { isCI, getCIName } = require(`../ci`)

    expect(isCI()).toBeTruthy()
    expect(getCIName()).toEqual(`ZEIT Now`)
  })

  it(`Detects Now v1`, () => {
    process.env.NOW_REGION = `none`
    const { isCI, getCIName } = require(`../ci`)

    expect(isCI()).toBeTruthy()
    expect(getCIName()).toEqual(`ZEIT Now v1`)
  })

  it(`Detects Heroku`, () => {
    process.env.NODE = `/tmp/build_8a43526a8849e690a3b67906d404e434/.heroku/node/bin/node`
    const { isCI, getCIName } = require(`../ci`)

    expect(isCI()).toBeTruthy()
    expect(getCIName()).toEqual(`Heroku`)
  })
  it(`Detects CI and CI_NAME`, () => {
    process.env.CI = true
    process.env.CI_NAME = `test CI`
    const { isCI, getCIName } = require(`../ci`)

    expect(isCI()).toBeTruthy()
    expect(getCIName()).toEqual(`test CI`)
  })
})

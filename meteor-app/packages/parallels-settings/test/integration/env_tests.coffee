# TODO: So much fucking magic here! What's the right way to test this?
#
#class EnvTestCase extends ClassyTestCase
#  @testName: 'ParallelsSettings'
#
#  setUpServer: =>
#    process.env.PARALLELS_FOO = true
#
#  testClientEnvSettings: [
#    ->
#      @assertEqual Parallels.settings.get('PARALLELS_FOO'), 'true'
#  ]
#
#ClassyTestCase.addTest new EnvTestCase()
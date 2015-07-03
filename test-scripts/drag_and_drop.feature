Feature: Drag + Drop Files

  @dev
  Scenario: User drags a file onto the map from their desktop
    When I drag an image file onto the map
    Then I should see a new image bit
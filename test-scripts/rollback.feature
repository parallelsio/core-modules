Feature: Rolling back changes made to a canvas

  @dev
  Scenario: User creates a new bit and then rolls back the creation
    When I create a new text bit on the canvas with content "Rolling back content"
    And I click the "Rollback" link in the event stream
    Then the bit should be gone
    And I should not see an event for creating the bit in my event stream
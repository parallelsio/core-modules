#!/bin/bash

# On Mac OS X GNU grep is ggrep.
if hash ggrep 2>/dev/null; then
  GREP='ggrep'
else
  GREP='grep'
fi

SPECIFIED_PACKAGES="$1"
if [ -z "${SPECIFIED_PACKAGES}" ]; then
  PACKAGES=( $(find meteor-app/packages -type d | $GREP -v .npm | $GREP -i '\/test$' | $GREP -Po 'meteor-app/packages/\K.*(?=/)' | sort -u) )
else
  PACKAGES=("$SPECIFIED_PACKAGES")
fi

# Perform tests.
TESTS_FAILED=0
PACKAGES_FAILED=""
for pkg in "${PACKAGES[@]}"; do
  if [ -d "meteor-app/packages/${pkg}/test/unit" ]; then
    echo ">>> Testing package '${pkg}'..."
    mocha meteor-app/packages/${pkg}/test/unit || {
      echo "ERROR: Tests for package '${pkg}' failed."
      TESTS_FAILED=1
      PACKAGES_FAILED="${PACKAGES_FAILED} ${pkg}"
    }
  fi
done

exit ${TESTS_FAILED}

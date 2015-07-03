#!/bin/bash

# On Mac OS X GNU grep is ggrep.
if hash ggrep 2>/dev/null; then
  GREP='ggrep'
else
  GREP='grep'
fi

SPECIFIED_PACKAGES="$1"
if [ -z "${SPECIFIED_PACKAGES}" ]; then
  PACKAGES=( $(find app/packages -type d | $GREP -v .npm | $GREP -i '\/test$' | $GREP -Po 'app/packages/\K.*(?=/)' | sort -u) )
else
  PACKAGES=("$SPECIFIED_PACKAGES")
fi

# Perform tests.
TESTS_FAILED=0
PACKAGES_FAILED=""
for pkg in ${PACKAGES}; do
  if [ -d "app/packages/${pkg}/test" ]; then
    echo ">>> Testing package '${pkg}'..."
    mocha app/packages/${pkg}/test || {
      echo "ERROR: Tests for package '${pkg}' failed."
      TESTS_FAILED=1
      PACKAGES_FAILED="${PACKAGES_FAILED} ${pkg}"
    }
  fi
done

exit ${TESTS_FAILED}

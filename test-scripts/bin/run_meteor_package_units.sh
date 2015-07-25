#!/bin/bash

SPECIFIED_PACKAGES="$1"
if [ -z "${SPECIFIED_PACKAGES}" ]; then
  PACKAGES=( $(find meteor-app/packages -type d | grep -v .npm | grep -i '\/test$' | perl -nle 'print $& if m{meteor-app/packages/\K.*(?=/)}' | sort -u) )
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

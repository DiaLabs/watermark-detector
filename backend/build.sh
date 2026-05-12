#!/bin/bash
set -e
pip install --upgrade pip setuptools wheel
pip install --prefer-binary --only-binary :all: -r requirements.txt || pip install --prefer-binary -r requirements.txt


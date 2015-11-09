"""
python setup.py develop
"""
from setuptools import setup, find_packages
import os

if __name__ == "__main__":
    setup(
        name = "indico_editor",
        packages = find_packages(),
        install_requires = [
            "tornado==4.1",
            "IndicoIo==0.10.1",
            "futures==3.0.3"
        ],
        version = "0.1.0"
    )

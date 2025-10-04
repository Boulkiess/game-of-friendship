# Makefile

# Define the Node.js version
NODE_VERSION ?= 20

# Define the environment name
ENV_NAME=conda_game-of-friendship_$(NODE_VERSION)
ACTIVATION_SCRIPT=activate_conda_$(NODE_VERSION)

# Target to create a conda environment with Node.js
env:
	conda create -n $(ENV_NAME) nodejs=$(NODE_VERSION) -y
	echo "conda activate $(ENV_NAME)" > $(ACTIVATION_SCRIPT)

#Double click in Finder to run, or right click and select open in Terminal

/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" # installs brew, if already installed does nothing
brew install coreutils # installs needed coreutils with brew
bash <(curl -fsSL cheddar.vihan.org/i/nix/cheddar) # fetches and runs build/install script

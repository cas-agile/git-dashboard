FROM ubuntu:focal

# Python 3.6 (for Gitinspector)
RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update
RUN apt-get install -y python3.6
RUN ln -s /usr/bin/python3.6 /usr/bin/python

# Locale
RUN apt-get install -y locales
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en

# Git
RUN apt-get install -y git

# NodeJS
WORKDIR /tmp
RUN apt-get install -y wget
RUN wget https://nodejs.org/dist/v18.16.0/node-v18.16.0-linux-x64.tar.gz
RUN tar -xf node-v18.16.0-linux-x64.tar.gz
RUN mv ./node-v18.16.0-linux-x64 /usr/lib/node18.16.0
RUN ln -s /usr/lib/node18.16.0/bin/node /usr/bin/node
RUN ln -s /usr/lib/node18.16.0/bin/npm /usr/bin/npm
RUN ln -s /usr/lib/node18.16.0/bin/npx /usr/bin/npx

# Gource
WORKDIR /tmp
RUN apt-get install -y ffmpeg
RUN apt-get install -y build-essential xvfb libsdl2-dev libsdl2-image-dev libpcre3-dev libfreetype6-dev libglew-dev libglm-dev libboost-filesystem-dev libpng-dev libsdl1.2-dev libsdl-image1.2-dev libtinyxml-dev
RUN wget https://github.com/acaudwell/Gource/releases/download/gource-0.54/gource-0.54.tar.gz
RUN tar -xf gource-0.54.tar.gz
WORKDIR /tmp/gource-0.54
RUN ./configure
RUN make
RUN make install

WORKDIR /git-dashboard

ARG PUBLIC_URL
ENV PUBLIC_URL $PUBLIC_URL
ENV VITE_PUBLIC_URL $PUBLIC_URL

COPY package*.json ./
RUN npm install
RUN npm i -g gitinspector

COPY . .

WORKDIR /git-dashboard/frontend
RUN npm run build

WORKDIR /git-dashboard
CMD ["npm", "start"]
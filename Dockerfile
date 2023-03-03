FROM node:14-slim as base

# Adding in the required files
ADD . /service
WORKDIR /service
RUN ["npm", "install"]
RUN ["npm", "install", "-g", "grunt-cli"]
RUN ["grunt", "requirejs:prod", "less:prod"]

FROM docker.atl-paas.net/sox/micros-node-14:1.0.1

COPY --from=base /service /service

# Export to PORT 8080 for Micros
ENV PORT 8080
EXPOSE 8080

WORKDIR /service
CMD ["index.js"]

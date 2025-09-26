FROM node:20 as base

# Adding in the required files
ADD . /service
WORKDIR /service
RUN ["npm", "install"]

# https://jira.atlassian.com/browse/BCLOUD-17319
RUN chown -R root:root /service

FROM docker.atl-paas.net/sox/micros-node-20:1.1.10

COPY --from=base /service /opt/service

# Export to PORT 8080 for Micros
ENV PORT 8080
EXPOSE 8080
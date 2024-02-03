# Begin Data changelog

---

## [5.0.0] 2024-02-03

Begin Data just got a lot faster. Gone are the days of 500-1000ms cold starts due to instantiating the AWS SDK – Begin Data v5 is now between 2-5x faster, and uses 2-4x less memory, courtesy of [aws-lite](https://aws-lite.org)!

---

## [4.0.0] 2022-02-07

### Added

- Added support for Sandbox dynamic port selection
  - Added best-effort attempt to find Sandbox ports via internal SSM


### Changed

- Deep require `aws-sdk` deps for a potentially large cold start perf boost
- Breaking change: Begin Data no longer relies on or makes direct use of `NODE_ENV` or other legacy Architect env vars. `@begin/data` v4+ now requires Architect v10 / Sandbox v5 or later.
- Improved table lookup performance

---

## [3.0.4] 2021-10-18

### Fixed

- Fixed issue so that if present `ARC_ENV` takes precedence over `NODE_ENV` for stage.

---

## [3.0.3] 2021-10-14

### Fixed

- Fixed issue where Begin Data may not work in unit tests with Sandbox >= 4.1

---

## [3.0.1 - 3.0.2] 2021-09-20

### Changed

- Enforce minimum of Node 12
- Updated dependencies

---

## [3.0.0] 2021-07-22

### Changed

- Breaking change: Begin Data no longer supports Node.js 10 (now EOL, and no longer available to create / update in AWS Lambda)
- Potentially breaking change: Begin Data now requires `@architect/sandbox` 4.0 or greater for local use
- Removed Arc v5 deprecation warnings
- Linted some stuff, tidied up project files
- Updated dependencies


### Fixed

- Removed unnecessary dependency

---

## [2.0.0 - 2.0.1] 2021-03-18

### Added

- Added lookup for Begin Data table in Architect Sandbox via new internal service discovery endpoint
- Fixed local file path issue for loading Architect project manifests that aren't `.arc` (e.g. `app.arc`, `arc.yaml`, etc.)


### Fixed

- Fixed missing dependency

---

## [1.2.0 - 1.2.2] 2020-02-12 - 2020-04-19

### Added

- Increase soft row size limit to 200KB
- Added some nice performance improvements related to connection reuse in live AWS
- `incr` and `decr` now set the default property value to be incremented or decremented to zero

### Fixed

- `get` will no longer return rows for tables with same leading characters (see smallwins/begin-issues#20)

### Changed

- Refactored private helper modules into `src/helpers`
- Moved from `hashids` to `@begin/hashids` to keep the package weight down
- Removed `package-lock.json` [good explainer as to why/when](https://github.com/sindresorhus/ama/issues/479) and [further rationale here](https://www.twilio.com/blog/lockfiles-nodejs)


### Fixed

- Fixed module instantiation issues in testing scenarios

---

## [1.1.6 - 1.1.7] 2020-02-05

### Added

- Added support for dynamic local database port configuration in Sandbox (`ARC_TABLES_PORT`)


### Fixed

- Fixed issue with Begin Data not working correctly locally if you don't have an `~/.aws/credentials` file; fixes @begin-issues#15, thanks @wesbos!

---

## [1.1.5] 2020-02-01

### Fixed

- Fixes table lookup compatibility with Architect 6 projects running locally in Sandbox

---

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

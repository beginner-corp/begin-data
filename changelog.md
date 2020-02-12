# Begin Data changelog

---

## [1.2.0] 2020-02-12

### Added

- Increase soft row size limit to 200KB
- Added some nice performance improvements related to connection reuse in live AWS


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

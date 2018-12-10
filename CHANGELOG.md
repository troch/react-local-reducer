<a name="3.0.1"></a>
## [3.0.1](https://github.com/troch/react-local-reducer/compare/v3.0.0...v3.0.1) (2018-12-10)

### Bug Fixes

* Safely read context



<a name="3.0.0"></a>
## [3.0.0](https://github.com/troch/react-local-reducer/compare/v2.0.1...v3.0.0) (2018-12-10)

**BREAKING CHANGES**

In order to support the new version of `react-redux` (v6), the following breaking changes have been introduced

- This packages now requires React 16.6.0 and above
- `setContextTypes` has been renamed to `setContextType` and requires a React context. If you want your local reducers to be hooked to your store, the provided context should be an object containing a `store` property. You can pass alongside it any other dependency, which will be passed to your reducer factories.



<a name="2.0.1"></a>
## [2.0.1](https://github.com/troch/react-local-reducer/compare/v1.0.4...v2.0.1) (2018-07-02)


### Bug Fixes

* fix peer dependency requirements ([7cbb9bc](https://github.com/troch/react-local-reducer/commit/7cbb9bc))


### Features

* map to props as a function ([b4fe4e8](https://github.com/troch/react-local-reducer/commit/b4fe4e8))



<a name="1.0.4"></a>
## [1.0.4](https://github.com/troch/react-local-reducer/compare/v1.0.3...v1.0.4) (2017-10-12)


### Bug Fixes

* replace replaceState by setState ([be077fd](https://github.com/troch/react-local-reducer/commit/be077fd))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/troch/react-local-reducer/compare/v1.0.2...v1.0.3) (2017-10-12)


### Bug Fixes

* correctly call reducer ([f8ba7a0](https://github.com/troch/react-local-reducer/commit/f8ba7a0))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/troch/react-local-reducer/compare/v1.0.1...v1.0.2) (2017-10-12)


### Bug Fixes

* fix reading from reducer options ([a32a370](https://github.com/troch/react-local-reducer/commit/a32a370))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/troch/react-local-reducer/compare/v1.0.0...v1.0.1) (2017-09-25)



<a name="1.0.0"></a>
# 1.0.0 (2017-09-24)




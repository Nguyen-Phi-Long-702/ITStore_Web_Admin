(function () {
  const v = document.createElement("link").relList;
  if (v && v.supports && v.supports("modulepreload")) return;
  for (const C of document.querySelectorAll('link[rel="modulepreload"]')) x(C);
  new MutationObserver((C) => {
    for (const _ of C)
      if (_.type === "childList")
        for (const N of _.addedNodes)
          N.tagName === "LINK" && N.rel === "modulepreload" && x(N);
  }).observe(document, { childList: !0, subtree: !0 });
  function c(C) {
    const _ = {};
    return (
      C.integrity && (_.integrity = C.integrity),
      C.referrerPolicy && (_.referrerPolicy = C.referrerPolicy),
      C.crossOrigin === "use-credentials"
        ? (_.credentials = "include")
        : C.crossOrigin === "anonymous"
          ? (_.credentials = "omit")
          : (_.credentials = "same-origin"),
      _
    );
  }
  function x(C) {
    if (C.ep) return;
    C.ep = !0;
    const _ = c(C);
    fetch(C.href, _);
  }
})();
var Ui = { exports: {} },
  Lr = {},
  Vi = { exports: {} },
  G = {};
var $a;
function gd() {
  if ($a) return G;
  $a = 1;
  var s = Symbol.for("react.element"),
    v = Symbol.for("react.portal"),
    c = Symbol.for("react.fragment"),
    x = Symbol.for("react.strict_mode"),
    C = Symbol.for("react.profiler"),
    _ = Symbol.for("react.provider"),
    N = Symbol.for("react.context"),
    W = Symbol.for("react.forward_ref"),
    P = Symbol.for("react.suspense"),
    X = Symbol.for("react.memo"),
    J = Symbol.for("react.lazy"),
    ee = Symbol.iterator;
  function re(d) {
    return d === null || typeof d != "object"
      ? null
      : ((d = (ee && d[ee]) || d["@@iterator"]),
        typeof d == "function" ? d : null);
  }
  var ze = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    se = Object.assign,
    Y = {};
  function q(d, y, F) {
    ((this.props = d),
      (this.context = y),
      (this.refs = Y),
      (this.updater = F || ze));
  }
  ((q.prototype.isReactComponent = {}),
    (q.prototype.setState = function (d, y) {
      if (typeof d != "object" && typeof d != "function" && d != null)
        throw Error(
          "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, d, y, "setState");
    }),
    (q.prototype.forceUpdate = function (d) {
      this.updater.enqueueForceUpdate(this, d, "forceUpdate");
    }));
  function Ie() {}
  Ie.prototype = q.prototype;
  function He(d, y, F) {
    ((this.props = d),
      (this.context = y),
      (this.refs = Y),
      (this.updater = F || ze));
  }
  var Oe = (He.prototype = new Ie());
  ((Oe.constructor = He), se(Oe, q.prototype), (Oe.isPureReactComponent = !0));
  var pe = Array.isArray,
    Ne = Object.prototype.hasOwnProperty,
    me = { current: null },
    ke = { key: !0, ref: !0, __self: !0, __source: !0 };
  function D(d, y, F) {
    var B,
      K = {},
      Z = null,
      Q = null;
    if (y != null)
      for (B in (y.ref !== void 0 && (Q = y.ref),
      y.key !== void 0 && (Z = "" + y.key),
      y))
        Ne.call(y, B) && !ke.hasOwnProperty(B) && (K[B] = y[B]);
    var te = arguments.length - 2;
    if (te === 1) K.children = F;
    else if (1 < te) {
      for (var oe = Array(te), Re = 0; Re < te; Re++)
        oe[Re] = arguments[Re + 2];
      K.children = oe;
    }
    if (d && d.defaultProps)
      for (B in ((te = d.defaultProps), te)) K[B] === void 0 && (K[B] = te[B]);
    return {
      $$typeof: s,
      type: d,
      key: Z,
      ref: Q,
      props: K,
      _owner: me.current,
    };
  }
  function Pe(d, y) {
    return {
      $$typeof: s,
      type: d.type,
      key: y,
      ref: d.ref,
      props: d.props,
      _owner: d._owner,
    };
  }
  function lt(d) {
    return typeof d == "object" && d !== null && d.$$typeof === s;
  }
  function yt(d) {
    var y = { "=": "=0", ":": "=2" };
    return (
      "$" +
      d.replace(/[=:]/g, function (F) {
        return y[F];
      })
    );
  }
  var Qe = /\/+/g;
  function Ae(d, y) {
    return typeof d == "object" && d !== null && d.key != null
      ? yt("" + d.key)
      : y.toString(36);
  }
  function $e(d, y, F, B, K) {
    var Z = typeof d;
    (Z === "undefined" || Z === "boolean") && (d = null);
    var Q = !1;
    if (d === null) Q = !0;
    else
      switch (Z) {
        case "string":
        case "number":
          Q = !0;
          break;
        case "object":
          switch (d.$$typeof) {
            case s:
            case v:
              Q = !0;
          }
      }
    if (Q)
      return (
        (Q = d),
        (K = K(Q)),
        (d = B === "" ? "." + Ae(Q, 0) : B),
        pe(K)
          ? ((F = ""),
            d != null && (F = d.replace(Qe, "$&/") + "/"),
            $e(K, y, F, "", function (Re) {
              return Re;
            }))
          : K != null &&
            (lt(K) &&
              (K = Pe(
                K,
                F +
                  (!K.key || (Q && Q.key === K.key)
                    ? ""
                    : ("" + K.key).replace(Qe, "$&/") + "/") +
                  d,
              )),
            y.push(K)),
        1
      );
    if (((Q = 0), (B = B === "" ? "." : B + ":"), pe(d)))
      for (var te = 0; te < d.length; te++) {
        Z = d[te];
        var oe = B + Ae(Z, te);
        Q += $e(Z, y, F, oe, K);
      }
    else if (((oe = re(d)), typeof oe == "function"))
      for (d = oe.call(d), te = 0; !(Z = d.next()).done; )
        ((Z = Z.value), (oe = B + Ae(Z, te++)), (Q += $e(Z, y, F, oe, K)));
    else if (Z === "object")
      throw (
        (y = String(d)),
        Error(
          "Objects are not valid as a React child (found: " +
            (y === "[object Object]"
              ? "object with keys {" + Object.keys(d).join(", ") + "}"
              : y) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    return Q;
  }
  function je(d, y, F) {
    if (d == null) return d;
    var B = [],
      K = 0;
    return (
      $e(d, B, "", "", function (Z) {
        return y.call(F, Z, K++);
      }),
      B
    );
  }
  function fe(d) {
    if (d._status === -1) {
      var y = d._result;
      ((y = y()),
        y.then(
          function (F) {
            (d._status === 0 || d._status === -1) &&
              ((d._status = 1), (d._result = F));
          },
          function (F) {
            (d._status === 0 || d._status === -1) &&
              ((d._status = 2), (d._result = F));
          },
        ),
        d._status === -1 && ((d._status = 0), (d._result = y)));
    }
    if (d._status === 1) return d._result.default;
    throw d._result;
  }
  var le = { current: null },
    g = { transition: null },
    A = {
      ReactCurrentDispatcher: le,
      ReactCurrentBatchConfig: g,
      ReactCurrentOwner: me,
    };
  function R() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return (
    (G.Children = {
      map: je,
      forEach: function (d, y, F) {
        je(
          d,
          function () {
            y.apply(this, arguments);
          },
          F,
        );
      },
      count: function (d) {
        var y = 0;
        return (
          je(d, function () {
            y++;
          }),
          y
        );
      },
      toArray: function (d) {
        return (
          je(d, function (y) {
            return y;
          }) || []
        );
      },
      only: function (d) {
        if (!lt(d))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return d;
      },
    }),
    (G.Component = q),
    (G.Fragment = c),
    (G.Profiler = C),
    (G.PureComponent = He),
    (G.StrictMode = x),
    (G.Suspense = P),
    (G.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = A),
    (G.act = R),
    (G.cloneElement = function (d, y, F) {
      if (d == null)
        throw Error(
          "React.cloneElement(...): The argument must be a React element, but you passed " +
            d +
            ".",
        );
      var B = se({}, d.props),
        K = d.key,
        Z = d.ref,
        Q = d._owner;
      if (y != null) {
        if (
          (y.ref !== void 0 && ((Z = y.ref), (Q = me.current)),
          y.key !== void 0 && (K = "" + y.key),
          d.type && d.type.defaultProps)
        )
          var te = d.type.defaultProps;
        for (oe in y)
          Ne.call(y, oe) &&
            !ke.hasOwnProperty(oe) &&
            (B[oe] = y[oe] === void 0 && te !== void 0 ? te[oe] : y[oe]);
      }
      var oe = arguments.length - 2;
      if (oe === 1) B.children = F;
      else if (1 < oe) {
        te = Array(oe);
        for (var Re = 0; Re < oe; Re++) te[Re] = arguments[Re + 2];
        B.children = te;
      }
      return { $$typeof: s, type: d.type, key: K, ref: Z, props: B, _owner: Q };
    }),
    (G.createContext = function (d) {
      return (
        (d = {
          $$typeof: N,
          _currentValue: d,
          _currentValue2: d,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
          _defaultValue: null,
          _globalName: null,
        }),
        (d.Provider = { $$typeof: _, _context: d }),
        (d.Consumer = d)
      );
    }),
    (G.createElement = D),
    (G.createFactory = function (d) {
      var y = D.bind(null, d);
      return ((y.type = d), y);
    }),
    (G.createRef = function () {
      return { current: null };
    }),
    (G.forwardRef = function (d) {
      return { $$typeof: W, render: d };
    }),
    (G.isValidElement = lt),
    (G.lazy = function (d) {
      return { $$typeof: J, _payload: { _status: -1, _result: d }, _init: fe };
    }),
    (G.memo = function (d, y) {
      return { $$typeof: X, type: d, compare: y === void 0 ? null : y };
    }),
    (G.startTransition = function (d) {
      var y = g.transition;
      g.transition = {};
      try {
        d();
      } finally {
        g.transition = y;
      }
    }),
    (G.unstable_act = R),
    (G.useCallback = function (d, y) {
      return le.current.useCallback(d, y);
    }),
    (G.useContext = function (d) {
      return le.current.useContext(d);
    }),
    (G.useDebugValue = function () {}),
    (G.useDeferredValue = function (d) {
      return le.current.useDeferredValue(d);
    }),
    (G.useEffect = function (d, y) {
      return le.current.useEffect(d, y);
    }),
    (G.useId = function () {
      return le.current.useId();
    }),
    (G.useImperativeHandle = function (d, y, F) {
      return le.current.useImperativeHandle(d, y, F);
    }),
    (G.useInsertionEffect = function (d, y) {
      return le.current.useInsertionEffect(d, y);
    }),
    (G.useLayoutEffect = function (d, y) {
      return le.current.useLayoutEffect(d, y);
    }),
    (G.useMemo = function (d, y) {
      return le.current.useMemo(d, y);
    }),
    (G.useReducer = function (d, y, F) {
      return le.current.useReducer(d, y, F);
    }),
    (G.useRef = function (d) {
      return le.current.useRef(d);
    }),
    (G.useState = function (d) {
      return le.current.useState(d);
    }),
    (G.useSyncExternalStore = function (d, y, F) {
      return le.current.useSyncExternalStore(d, y, F);
    }),
    (G.useTransition = function () {
      return le.current.useTransition();
    }),
    (G.version = "18.3.1"),
    G
  );
}
var Ga;
function Yi() {
  return (Ga || ((Ga = 1), (Vi.exports = gd())), Vi.exports);
}
var Ka;
function vd() {
  if (Ka) return Lr;
  Ka = 1;
  var s = Yi(),
    v = Symbol.for("react.element"),
    c = Symbol.for("react.fragment"),
    x = Object.prototype.hasOwnProperty,
    C = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    _ = { key: !0, ref: !0, __self: !0, __source: !0 };
  function N(W, P, X) {
    var J,
      ee = {},
      re = null,
      ze = null;
    (X !== void 0 && (re = "" + X),
      P.key !== void 0 && (re = "" + P.key),
      P.ref !== void 0 && (ze = P.ref));
    for (J in P) x.call(P, J) && !_.hasOwnProperty(J) && (ee[J] = P[J]);
    if (W && W.defaultProps)
      for (J in ((P = W.defaultProps), P)) ee[J] === void 0 && (ee[J] = P[J]);
    return {
      $$typeof: v,
      type: W,
      key: re,
      ref: ze,
      props: ee,
      _owner: C.current,
    };
  }
  return ((Lr.Fragment = c), (Lr.jsx = N), (Lr.jsxs = N), Lr);
}
var Xa;
function yd() {
  return (Xa || ((Xa = 1), (Ui.exports = vd())), Ui.exports);
}
var Se = yd(),
  Wl = {},
  Bi = { exports: {} },
  be = {},
  Wi = { exports: {} },
  Hi = {};
var Ya;
function wd() {
  return (
    Ya ||
      ((Ya = 1),
      (function (s) {
        function v(g, A) {
          var R = g.length;
          g.push(A);
          e: for (; 0 < R; ) {
            var d = (R - 1) >>> 1,
              y = g[d];
            if (0 < C(y, A)) ((g[d] = A), (g[R] = y), (R = d));
            else break e;
          }
        }
        function c(g) {
          return g.length === 0 ? null : g[0];
        }
        function x(g) {
          if (g.length === 0) return null;
          var A = g[0],
            R = g.pop();
          if (R !== A) {
            g[0] = R;
            e: for (var d = 0, y = g.length, F = y >>> 1; d < F; ) {
              var B = 2 * (d + 1) - 1,
                K = g[B],
                Z = B + 1,
                Q = g[Z];
              if (0 > C(K, R))
                Z < y && 0 > C(Q, K)
                  ? ((g[d] = Q), (g[Z] = R), (d = Z))
                  : ((g[d] = K), (g[B] = R), (d = B));
              else if (Z < y && 0 > C(Q, R)) ((g[d] = Q), (g[Z] = R), (d = Z));
              else break e;
            }
          }
          return A;
        }
        function C(g, A) {
          var R = g.sortIndex - A.sortIndex;
          return R !== 0 ? R : g.id - A.id;
        }
        if (
          typeof performance == "object" &&
          typeof performance.now == "function"
        ) {
          var _ = performance;
          s.unstable_now = function () {
            return _.now();
          };
        } else {
          var N = Date,
            W = N.now();
          s.unstable_now = function () {
            return N.now() - W;
          };
        }
        var P = [],
          X = [],
          J = 1,
          ee = null,
          re = 3,
          ze = !1,
          se = !1,
          Y = !1,
          q = typeof setTimeout == "function" ? setTimeout : null,
          Ie = typeof clearTimeout == "function" ? clearTimeout : null,
          He = typeof setImmediate < "u" ? setImmediate : null;
        typeof navigator < "u" &&
          navigator.scheduling !== void 0 &&
          navigator.scheduling.isInputPending !== void 0 &&
          navigator.scheduling.isInputPending.bind(navigator.scheduling);
        function Oe(g) {
          for (var A = c(X); A !== null; ) {
            if (A.callback === null) x(X);
            else if (A.startTime <= g)
              (x(X), (A.sortIndex = A.expirationTime), v(P, A));
            else break;
            A = c(X);
          }
        }
        function pe(g) {
          if (((Y = !1), Oe(g), !se))
            if (c(P) !== null) ((se = !0), fe(Ne));
            else {
              var A = c(X);
              A !== null && le(pe, A.startTime - g);
            }
        }
        function Ne(g, A) {
          ((se = !1), Y && ((Y = !1), Ie(D), (D = -1)), (ze = !0));
          var R = re;
          try {
            for (
              Oe(A), ee = c(P);
              ee !== null && (!(ee.expirationTime > A) || (g && !yt()));
            ) {
              var d = ee.callback;
              if (typeof d == "function") {
                ((ee.callback = null), (re = ee.priorityLevel));
                var y = d(ee.expirationTime <= A);
                ((A = s.unstable_now()),
                  typeof y == "function"
                    ? (ee.callback = y)
                    : ee === c(P) && x(P),
                  Oe(A));
              } else x(P);
              ee = c(P);
            }
            if (ee !== null) var F = !0;
            else {
              var B = c(X);
              (B !== null && le(pe, B.startTime - A), (F = !1));
            }
            return F;
          } finally {
            ((ee = null), (re = R), (ze = !1));
          }
        }
        var me = !1,
          ke = null,
          D = -1,
          Pe = 5,
          lt = -1;
        function yt() {
          return !(s.unstable_now() - lt < Pe);
        }
        function Qe() {
          if (ke !== null) {
            var g = s.unstable_now();
            lt = g;
            var A = !0;
            try {
              A = ke(!0, g);
            } finally {
              A ? Ae() : ((me = !1), (ke = null));
            }
          } else me = !1;
        }
        var Ae;
        if (typeof He == "function")
          Ae = function () {
            He(Qe);
          };
        else if (typeof MessageChannel < "u") {
          var $e = new MessageChannel(),
            je = $e.port2;
          (($e.port1.onmessage = Qe),
            (Ae = function () {
              je.postMessage(null);
            }));
        } else
          Ae = function () {
            q(Qe, 0);
          };
        function fe(g) {
          ((ke = g), me || ((me = !0), Ae()));
        }
        function le(g, A) {
          D = q(function () {
            g(s.unstable_now());
          }, A);
        }
        ((s.unstable_IdlePriority = 5),
          (s.unstable_ImmediatePriority = 1),
          (s.unstable_LowPriority = 4),
          (s.unstable_NormalPriority = 3),
          (s.unstable_Profiling = null),
          (s.unstable_UserBlockingPriority = 2),
          (s.unstable_cancelCallback = function (g) {
            g.callback = null;
          }),
          (s.unstable_continueExecution = function () {
            se || ze || ((se = !0), fe(Ne));
          }),
          (s.unstable_forceFrameRate = function (g) {
            0 > g || 125 < g
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (Pe = 0 < g ? Math.floor(1e3 / g) : 5);
          }),
          (s.unstable_getCurrentPriorityLevel = function () {
            return re;
          }),
          (s.unstable_getFirstCallbackNode = function () {
            return c(P);
          }),
          (s.unstable_next = function (g) {
            switch (re) {
              case 1:
              case 2:
              case 3:
                var A = 3;
                break;
              default:
                A = re;
            }
            var R = re;
            re = A;
            try {
              return g();
            } finally {
              re = R;
            }
          }),
          (s.unstable_pauseExecution = function () {}),
          (s.unstable_requestPaint = function () {}),
          (s.unstable_runWithPriority = function (g, A) {
            switch (g) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                g = 3;
            }
            var R = re;
            re = g;
            try {
              return A();
            } finally {
              re = R;
            }
          }),
          (s.unstable_scheduleCallback = function (g, A, R) {
            var d = s.unstable_now();
            switch (
              (typeof R == "object" && R !== null
                ? ((R = R.delay),
                  (R = typeof R == "number" && 0 < R ? d + R : d))
                : (R = d),
              g)
            ) {
              case 1:
                var y = -1;
                break;
              case 2:
                y = 250;
                break;
              case 5:
                y = 1073741823;
                break;
              case 4:
                y = 1e4;
                break;
              default:
                y = 5e3;
            }
            return (
              (y = R + y),
              (g = {
                id: J++,
                callback: A,
                priorityLevel: g,
                startTime: R,
                expirationTime: y,
                sortIndex: -1,
              }),
              R > d
                ? ((g.sortIndex = R),
                  v(X, g),
                  c(P) === null &&
                    g === c(X) &&
                    (Y ? (Ie(D), (D = -1)) : (Y = !0), le(pe, R - d)))
                : ((g.sortIndex = y), v(P, g), se || ze || ((se = !0), fe(Ne))),
              g
            );
          }),
          (s.unstable_shouldYield = yt),
          (s.unstable_wrapCallback = function (g) {
            var A = re;
            return function () {
              var R = re;
              re = A;
              try {
                return g.apply(this, arguments);
              } finally {
                re = R;
              }
            };
          }));
      })(Hi)),
    Hi
  );
}
var Za;
function kd() {
  return (Za || ((Za = 1), (Wi.exports = wd())), Wi.exports);
}
var Ja;
function xd() {
  if (Ja) return be;
  Ja = 1;
  var s = Yi(),
    v = kd();
  function c(e) {
    for (
      var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e,
        n = 1;
      n < arguments.length;
      n++
    )
      t += "&args[]=" + encodeURIComponent(arguments[n]);
    return (
      "Minified React error #" +
      e +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  var x = new Set(),
    C = {};
  function _(e, t) {
    (N(e, t), N(e + "Capture", t));
  }
  function N(e, t) {
    for (C[e] = t, e = 0; e < t.length; e++) x.add(t[e]);
  }
  var W = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    P = Object.prototype.hasOwnProperty,
    X =
      /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    J = {},
    ee = {};
  function re(e) {
    return P.call(ee, e)
      ? !0
      : P.call(J, e)
        ? !1
        : X.test(e)
          ? (ee[e] = !0)
          : ((J[e] = !0), !1);
  }
  function ze(e, t, n, r) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return r
          ? !1
          : n !== null
            ? !n.acceptsBooleans
            : ((e = e.toLowerCase().slice(0, 5)),
              e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function se(e, t, n, r) {
    if (t === null || typeof t > "u" || ze(e, t, n, r)) return !0;
    if (r) return !1;
    if (n !== null)
      switch (n.type) {
        case 3:
          return !t;
        case 4:
          return t === !1;
        case 5:
          return isNaN(t);
        case 6:
          return isNaN(t) || 1 > t;
      }
    return !1;
  }
  function Y(e, t, n, r, l, o, i) {
    ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
      (this.attributeName = r),
      (this.attributeNamespace = l),
      (this.mustUseProperty = n),
      (this.propertyName = e),
      (this.type = t),
      (this.sanitizeURL = o),
      (this.removeEmptyString = i));
  }
  var q = {};
  ("children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
    .split(" ")
    .forEach(function (e) {
      q[e] = new Y(e, 0, !1, e, null, !1, !1);
    }),
    [
      ["acceptCharset", "accept-charset"],
      ["className", "class"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
    ].forEach(function (e) {
      var t = e[0];
      q[t] = new Y(t, 1, !1, e[1], null, !1, !1);
    }),
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(
      function (e) {
        q[e] = new Y(e, 2, !1, e.toLowerCase(), null, !1, !1);
      },
    ),
    [
      "autoReverse",
      "externalResourcesRequired",
      "focusable",
      "preserveAlpha",
    ].forEach(function (e) {
      q[e] = new Y(e, 2, !1, e, null, !1, !1);
    }),
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
      .split(" ")
      .forEach(function (e) {
        q[e] = new Y(e, 3, !1, e.toLowerCase(), null, !1, !1);
      }),
    ["checked", "multiple", "muted", "selected"].forEach(function (e) {
      q[e] = new Y(e, 3, !0, e, null, !1, !1);
    }),
    ["capture", "download"].forEach(function (e) {
      q[e] = new Y(e, 4, !1, e, null, !1, !1);
    }),
    ["cols", "rows", "size", "span"].forEach(function (e) {
      q[e] = new Y(e, 6, !1, e, null, !1, !1);
    }),
    ["rowSpan", "start"].forEach(function (e) {
      q[e] = new Y(e, 5, !1, e.toLowerCase(), null, !1, !1);
    }));
  var Ie = /[\-:]([a-z])/g;
  function He(e) {
    return e[1].toUpperCase();
  }
  ("accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
    .split(" ")
    .forEach(function (e) {
      var t = e.replace(Ie, He);
      q[t] = new Y(t, 1, !1, e, null, !1, !1);
    }),
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
      .split(" ")
      .forEach(function (e) {
        var t = e.replace(Ie, He);
        q[t] = new Y(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
      }),
    ["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
      var t = e.replace(Ie, He);
      q[t] = new Y(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
    }),
    ["tabIndex", "crossOrigin"].forEach(function (e) {
      q[e] = new Y(e, 1, !1, e.toLowerCase(), null, !1, !1);
    }),
    (q.xlinkHref = new Y(
      "xlinkHref",
      1,
      !1,
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      !1,
    )),
    ["src", "href", "action", "formAction"].forEach(function (e) {
      q[e] = new Y(e, 1, !1, e.toLowerCase(), null, !0, !0);
    }));
  function Oe(e, t, n, r) {
    var l = q.hasOwnProperty(t) ? q[t] : null;
    (l !== null
      ? l.type !== 0
      : r ||
        !(2 < t.length) ||
        (t[0] !== "o" && t[0] !== "O") ||
        (t[1] !== "n" && t[1] !== "N")) &&
      (se(t, n, l, r) && (n = null),
      r || l === null
        ? re(t) &&
          (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
        : l.mustUseProperty
          ? (e[l.propertyName] = n === null ? (l.type === 3 ? !1 : "") : n)
          : ((t = l.attributeName),
            (r = l.attributeNamespace),
            n === null
              ? e.removeAttribute(t)
              : ((l = l.type),
                (n = l === 3 || (l === 4 && n === !0) ? "" : "" + n),
                r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var pe = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    Ne = Symbol.for("react.element"),
    me = Symbol.for("react.portal"),
    ke = Symbol.for("react.fragment"),
    D = Symbol.for("react.strict_mode"),
    Pe = Symbol.for("react.profiler"),
    lt = Symbol.for("react.provider"),
    yt = Symbol.for("react.context"),
    Qe = Symbol.for("react.forward_ref"),
    Ae = Symbol.for("react.suspense"),
    $e = Symbol.for("react.suspense_list"),
    je = Symbol.for("react.memo"),
    fe = Symbol.for("react.lazy"),
    le = Symbol.for("react.offscreen"),
    g = Symbol.iterator;
  function A(e) {
    return e === null || typeof e != "object"
      ? null
      : ((e = (g && e[g]) || e["@@iterator"]),
        typeof e == "function" ? e : null);
  }
  var R = Object.assign,
    d;
  function y(e) {
    if (d === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        d = (t && t[1]) || "";
      }
    return (
      `
` +
      d +
      e
    );
  }
  var F = !1;
  function B(e, t) {
    if (!e || F) return "";
    F = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t)
        if (
          ((t = function () {
            throw Error();
          }),
          Object.defineProperty(t.prototype, "props", {
            set: function () {
              throw Error();
            },
          }),
          typeof Reflect == "object" && Reflect.construct)
        ) {
          try {
            Reflect.construct(t, []);
          } catch (h) {
            var r = h;
          }
          Reflect.construct(e, [], t);
        } else {
          try {
            t.call();
          } catch (h) {
            r = h;
          }
          e.call(t.prototype);
        }
      else {
        try {
          throw Error();
        } catch (h) {
          r = h;
        }
        e();
      }
    } catch (h) {
      if (h && r && typeof h.stack == "string") {
        for (
          var l = h.stack.split(`
`),
            o = r.stack.split(`
`),
            i = l.length - 1,
            u = o.length - 1;
          1 <= i && 0 <= u && l[i] !== o[u];
        )
          u--;
        for (; 1 <= i && 0 <= u; i--, u--)
          if (l[i] !== o[u]) {
            if (i !== 1 || u !== 1)
              do
                if ((i--, u--, 0 > u || l[i] !== o[u])) {
                  var a =
                    `
` + l[i].replace(" at new ", " at ");
                  return (
                    e.displayName &&
                      a.includes("<anonymous>") &&
                      (a = a.replace("<anonymous>", e.displayName)),
                    a
                  );
                }
              while (1 <= i && 0 <= u);
            break;
          }
      }
    } finally {
      ((F = !1), (Error.prepareStackTrace = n));
    }
    return (e = e ? e.displayName || e.name : "") ? y(e) : "";
  }
  function K(e) {
    switch (e.tag) {
      case 5:
        return y(e.type);
      case 16:
        return y("Lazy");
      case 13:
        return y("Suspense");
      case 19:
        return y("SuspenseList");
      case 0:
      case 2:
      case 15:
        return ((e = B(e.type, !1)), e);
      case 11:
        return ((e = B(e.type.render, !1)), e);
      case 1:
        return ((e = B(e.type, !0)), e);
      default:
        return "";
    }
  }
  function Z(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ke:
        return "Fragment";
      case me:
        return "Portal";
      case Pe:
        return "Profiler";
      case D:
        return "StrictMode";
      case Ae:
        return "Suspense";
      case $e:
        return "SuspenseList";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case yt:
          return (e.displayName || "Context") + ".Consumer";
        case lt:
          return (e._context.displayName || "Context") + ".Provider";
        case Qe:
          var t = e.render;
          return (
            (e = e.displayName),
            e ||
              ((e = t.displayName || t.name || ""),
              (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
            e
          );
        case je:
          return (
            (t = e.displayName || null),
            t !== null ? t : Z(e.type) || "Memo"
          );
        case fe:
          ((t = e._payload), (e = e._init));
          try {
            return Z(e(t));
          } catch {}
      }
    return null;
  }
  function Q(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t.displayName || "Context") + ".Consumer";
      case 10:
        return (t._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return (
          (e = t.render),
          (e = e.displayName || e.name || ""),
          t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
        );
      case 7:
        return "Fragment";
      case 5:
        return t;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Z(t);
      case 8:
        return t === D ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null;
        if (typeof t == "string") return t;
    }
    return null;
  }
  function te(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function oe(e) {
    var t = e.type;
    return (
      (e = e.nodeName) &&
      e.toLowerCase() === "input" &&
      (t === "checkbox" || t === "radio")
    );
  }
  function Re(e) {
    var t = oe(e) ? "checked" : "value",
      n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
      r = "" + e[t];
    if (
      !e.hasOwnProperty(t) &&
      typeof n < "u" &&
      typeof n.get == "function" &&
      typeof n.set == "function"
    ) {
      var l = n.get,
        o = n.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return l.call(this);
          },
          set: function (i) {
            ((r = "" + i), o.call(this, i));
          },
        }),
        Object.defineProperty(e, t, { enumerable: n.enumerable }),
        {
          getValue: function () {
            return r;
          },
          setValue: function (i) {
            r = "" + i;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function Ot(e) {
    e._valueTracker || (e._valueTracker = Re(e));
  }
  function tn(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
      r = "";
    return (
      e && (r = oe(e) ? (e.checked ? "true" : "false") : e.value),
      (e = r),
      e !== n ? (t.setValue(e), !0) : !1
    );
  }
  function Ir(e) {
    if (
      ((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")
    )
      return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function $l(e, t) {
    var n = t.checked;
    return R({}, t, {
      defaultChecked: void 0,
      defaultValue: void 0,
      value: void 0,
      checked: n ?? e._wrapperState.initialChecked,
    });
  }
  function qi(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue,
      r = t.checked != null ? t.checked : t.defaultChecked;
    ((n = te(t.value != null ? t.value : n)),
      (e._wrapperState = {
        initialChecked: r,
        initialValue: n,
        controlled:
          t.type === "checkbox" || t.type === "radio"
            ? t.checked != null
            : t.value != null,
      }));
  }
  function bi(e, t) {
    ((t = t.checked), t != null && Oe(e, "checked", t, !1));
  }
  function Gl(e, t) {
    bi(e, t);
    var n = te(t.value),
      r = t.type;
    if (n != null)
      r === "number"
        ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
        : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    (t.hasOwnProperty("value")
      ? Kl(e, t.type, n)
      : t.hasOwnProperty("defaultValue") && Kl(e, t.type, te(t.defaultValue)),
      t.checked == null &&
        t.defaultChecked != null &&
        (e.defaultChecked = !!t.defaultChecked));
  }
  function eu(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (
        !(
          (r !== "submit" && r !== "reset") ||
          (t.value !== void 0 && t.value !== null)
        )
      )
        return;
      ((t = "" + e._wrapperState.initialValue),
        n || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((n = e.name),
      n !== "" && (e.name = ""),
      (e.defaultChecked = !!e._wrapperState.initialChecked),
      n !== "" && (e.name = n));
  }
  function Kl(e, t, n) {
    (t !== "number" || Ir(e.ownerDocument) !== e) &&
      (n == null
        ? (e.defaultValue = "" + e._wrapperState.initialValue)
        : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var $n = Array.isArray;
  function vn(e, t, n, r) {
    if (((e = e.options), t)) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++)
        ((l = t.hasOwnProperty("$" + e[n].value)),
          e[n].selected !== l && (e[n].selected = l),
          l && r && (e[n].defaultSelected = !0));
    } else {
      for (n = "" + te(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          ((e[l].selected = !0), r && (e[l].defaultSelected = !0));
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Xl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(c(91));
    return R({}, t, {
      value: void 0,
      defaultValue: void 0,
      children: "" + e._wrapperState.initialValue,
    });
  }
  function tu(e, t) {
    var n = t.value;
    if (n == null) {
      if (((n = t.children), (t = t.defaultValue), n != null)) {
        if (t != null) throw Error(c(92));
        if ($n(n)) {
          if (1 < n.length) throw Error(c(93));
          n = n[0];
        }
        t = n;
      }
      (t == null && (t = ""), (n = t));
    }
    e._wrapperState = { initialValue: te(n) };
  }
  function nu(e, t) {
    var n = te(t.value),
      r = te(t.defaultValue);
    (n != null &&
      ((n = "" + n),
      n !== e.value && (e.value = n),
      t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
      r != null && (e.defaultValue = "" + r));
  }
  function ru(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue &&
      t !== "" &&
      t !== null &&
      (e.value = t);
  }
  function lu(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Yl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml"
      ? lu(t)
      : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
        ? "http://www.w3.org/1999/xhtml"
        : e;
  }
  var Or,
    ou = (function (e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
        ? function (t, n, r, l) {
            MSApp.execUnsafeLocalFunction(function () {
              return e(t, n, r, l);
            });
          }
        : e;
    })(function (e, t) {
      if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
        e.innerHTML = t;
      else {
        for (
          Or = Or || document.createElement("div"),
            Or.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
            t = Or.firstChild;
          e.firstChild;
        )
          e.removeChild(e.firstChild);
        for (; t.firstChild; ) e.appendChild(t.firstChild);
      }
    });
  function Gn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Kn = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0,
    },
    wc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Kn).forEach(function (e) {
    wc.forEach(function (t) {
      ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Kn[t] = Kn[e]));
    });
  });
  function iu(e, t, n) {
    return t == null || typeof t == "boolean" || t === ""
      ? ""
      : n || typeof t != "number" || t === 0 || (Kn.hasOwnProperty(e) && Kn[e])
        ? ("" + t).trim()
        : t + "px";
  }
  function uu(e, t) {
    e = e.style;
    for (var n in t)
      if (t.hasOwnProperty(n)) {
        var r = n.indexOf("--") === 0,
          l = iu(n, t[n], r);
        (n === "float" && (n = "cssFloat"),
          r ? e.setProperty(n, l) : (e[n] = l));
      }
  }
  var kc = R(
    { menuitem: !0 },
    {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0,
    },
  );
  function Zl(e, t) {
    if (t) {
      if (kc[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
        throw Error(c(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(c(60));
        if (
          typeof t.dangerouslySetInnerHTML != "object" ||
          !("__html" in t.dangerouslySetInnerHTML)
        )
          throw Error(c(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(c(62));
    }
  }
  function Jl(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var ql = null;
  function bl(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var eo = null,
    yn = null,
    wn = null;
  function su(e) {
    if ((e = hr(e))) {
      if (typeof eo != "function") throw Error(c(280));
      var t = e.stateNode;
      t && ((t = rl(t)), eo(e.stateNode, e.type, t));
    }
  }
  function au(e) {
    yn ? (wn ? wn.push(e) : (wn = [e])) : (yn = e);
  }
  function cu() {
    if (yn) {
      var e = yn,
        t = wn;
      if (((wn = yn = null), su(e), t)) for (e = 0; e < t.length; e++) su(t[e]);
    }
  }
  function fu(e, t) {
    return e(t);
  }
  function du() {}
  var to = !1;
  function pu(e, t, n) {
    if (to) return e(t, n);
    to = !0;
    try {
      return fu(e, t, n);
    } finally {
      ((to = !1), (yn !== null || wn !== null) && (du(), cu()));
    }
  }
  function Xn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = rl(n);
    if (r === null) return null;
    n = r[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((r = !r.disabled) ||
          ((e = e.type),
          (r = !(
            e === "button" ||
            e === "input" ||
            e === "select" ||
            e === "textarea"
          ))),
          (e = !r));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(c(231, t, typeof n));
    return n;
  }
  var no = !1;
  if (W)
    try {
      var Yn = {};
      (Object.defineProperty(Yn, "passive", {
        get: function () {
          no = !0;
        },
      }),
        window.addEventListener("test", Yn, Yn),
        window.removeEventListener("test", Yn, Yn));
    } catch {
      no = !1;
    }
  function xc(e, t, n, r, l, o, i, u, a) {
    var h = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, h);
    } catch (k) {
      this.onError(k);
    }
  }
  var Zn = !1,
    jr = null,
    Dr = !1,
    ro = null,
    Sc = {
      onError: function (e) {
        ((Zn = !0), (jr = e));
      },
    };
  function Ec(e, t, n, r, l, o, i, u, a) {
    ((Zn = !1), (jr = null), xc.apply(Sc, arguments));
  }
  function Cc(e, t, n, r, l, o, i, u, a) {
    if ((Ec.apply(this, arguments), Zn)) {
      if (Zn) {
        var h = jr;
        ((Zn = !1), (jr = null));
      } else throw Error(c(198));
      Dr || ((Dr = !0), (ro = h));
    }
  }
  function nn(e) {
    var t = e,
      n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do ((t = e), (t.flags & 4098) !== 0 && (n = t.return), (e = t.return));
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function mu(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (
        (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
        t !== null)
      )
        return t.dehydrated;
    }
    return null;
  }
  function hu(e) {
    if (nn(e) !== e) throw Error(c(188));
  }
  function _c(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = nn(e)), t === null)) throw Error(c(188));
      return t !== e ? null : e;
    }
    for (var n = e, r = t; ; ) {
      var l = n.return;
      if (l === null) break;
      var o = l.alternate;
      if (o === null) {
        if (((r = l.return), r !== null)) {
          n = r;
          continue;
        }
        break;
      }
      if (l.child === o.child) {
        for (o = l.child; o; ) {
          if (o === n) return (hu(l), e);
          if (o === r) return (hu(l), t);
          o = o.sibling;
        }
        throw Error(c(188));
      }
      if (n.return !== r.return) ((n = l), (r = o));
      else {
        for (var i = !1, u = l.child; u; ) {
          if (u === n) {
            ((i = !0), (n = l), (r = o));
            break;
          }
          if (u === r) {
            ((i = !0), (r = l), (n = o));
            break;
          }
          u = u.sibling;
        }
        if (!i) {
          for (u = o.child; u; ) {
            if (u === n) {
              ((i = !0), (n = o), (r = l));
              break;
            }
            if (u === r) {
              ((i = !0), (r = o), (n = l));
              break;
            }
            u = u.sibling;
          }
          if (!i) throw Error(c(189));
        }
      }
      if (n.alternate !== r) throw Error(c(190));
    }
    if (n.tag !== 3) throw Error(c(188));
    return n.stateNode.current === n ? e : t;
  }
  function gu(e) {
    return ((e = _c(e)), e !== null ? vu(e) : null);
  }
  function vu(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = vu(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var yu = v.unstable_scheduleCallback,
    wu = v.unstable_cancelCallback,
    zc = v.unstable_shouldYield,
    Nc = v.unstable_requestPaint,
    ye = v.unstable_now,
    Pc = v.unstable_getCurrentPriorityLevel,
    lo = v.unstable_ImmediatePriority,
    ku = v.unstable_UserBlockingPriority,
    Fr = v.unstable_NormalPriority,
    Rc = v.unstable_LowPriority,
    xu = v.unstable_IdlePriority,
    Ar = null,
    wt = null;
  function Lc(e) {
    if (wt && typeof wt.onCommitFiberRoot == "function")
      try {
        wt.onCommitFiberRoot(Ar, e, void 0, (e.current.flags & 128) === 128);
      } catch {}
  }
  var ft = Math.clz32 ? Math.clz32 : Ic,
    Tc = Math.log,
    Mc = Math.LN2;
  function Ic(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((Tc(e) / Mc) | 0)) | 0);
  }
  var Ur = 64,
    Vr = 4194304;
  function Jn(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function Br(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0,
      l = e.suspendedLanes,
      o = e.pingedLanes,
      i = n & 268435455;
    if (i !== 0) {
      var u = i & ~l;
      u !== 0 ? (r = Jn(u)) : ((o &= i), o !== 0 && (r = Jn(o)));
    } else ((i = n & ~l), i !== 0 ? (r = Jn(i)) : o !== 0 && (r = Jn(o)));
    if (r === 0) return 0;
    if (
      t !== 0 &&
      t !== r &&
      (t & l) === 0 &&
      ((l = r & -r), (o = t & -t), l >= o || (l === 16 && (o & 4194240) !== 0))
    )
      return t;
    if (((r & 4) !== 0 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
      for (e = e.entanglements, t &= r; 0 < t; )
        ((n = 31 - ft(t)), (l = 1 << n), (r |= e[n]), (t &= ~l));
    return r;
  }
  function Oc(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function jc(e, t) {
    for (
      var n = e.suspendedLanes,
        r = e.pingedLanes,
        l = e.expirationTimes,
        o = e.pendingLanes;
      0 < o;
    ) {
      var i = 31 - ft(o),
        u = 1 << i,
        a = l[i];
      (a === -1
        ? ((u & n) === 0 || (u & r) !== 0) && (l[i] = Oc(u, t))
        : a <= t && (e.expiredLanes |= u),
        (o &= ~u));
    }
  }
  function oo(e) {
    return (
      (e = e.pendingLanes & -1073741825),
      e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
    );
  }
  function Su() {
    var e = Ur;
    return ((Ur <<= 1), (Ur & 4194240) === 0 && (Ur = 64), e);
  }
  function io(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function qn(e, t, n) {
    ((e.pendingLanes |= t),
      t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
      (e = e.eventTimes),
      (t = 31 - ft(t)),
      (e[t] = n));
  }
  function Dc(e, t) {
    var n = e.pendingLanes & ~t;
    ((e.pendingLanes = t),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.expiredLanes &= t),
      (e.mutableReadLanes &= t),
      (e.entangledLanes &= t),
      (t = e.entanglements));
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - ft(n),
        o = 1 << l;
      ((t[l] = 0), (r[l] = -1), (e[l] = -1), (n &= ~o));
    }
  }
  function uo(e, t) {
    var n = (e.entangledLanes |= t);
    for (e = e.entanglements; n; ) {
      var r = 31 - ft(n),
        l = 1 << r;
      ((l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l));
    }
  }
  var ie = 0;
  function Eu(e) {
    return (
      (e &= -e),
      1 < e ? (4 < e ? ((e & 268435455) !== 0 ? 16 : 536870912) : 4) : 1
    );
  }
  var Cu,
    so,
    _u,
    zu,
    Nu,
    ao = !1,
    Wr = [],
    jt = null,
    Dt = null,
    Ft = null,
    bn = new Map(),
    er = new Map(),
    At = [],
    Fc =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
        " ",
      );
  function Pu(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        jt = null;
        break;
      case "dragenter":
      case "dragleave":
        Dt = null;
        break;
      case "mouseover":
      case "mouseout":
        Ft = null;
        break;
      case "pointerover":
      case "pointerout":
        bn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        er.delete(t.pointerId);
    }
  }
  function tr(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o
      ? ((e = {
          blockedOn: t,
          domEventName: n,
          eventSystemFlags: r,
          nativeEvent: o,
          targetContainers: [l],
        }),
        t !== null && ((t = hr(t)), t !== null && so(t)),
        e)
      : ((e.eventSystemFlags |= r),
        (t = e.targetContainers),
        l !== null && t.indexOf(l) === -1 && t.push(l),
        e);
  }
  function Ac(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return ((jt = tr(jt, e, t, n, r, l)), !0);
      case "dragenter":
        return ((Dt = tr(Dt, e, t, n, r, l)), !0);
      case "mouseover":
        return ((Ft = tr(Ft, e, t, n, r, l)), !0);
      case "pointerover":
        var o = l.pointerId;
        return (bn.set(o, tr(bn.get(o) || null, e, t, n, r, l)), !0);
      case "gotpointercapture":
        return (
          (o = l.pointerId),
          er.set(o, tr(er.get(o) || null, e, t, n, r, l)),
          !0
        );
    }
    return !1;
  }
  function Ru(e) {
    var t = rn(e.target);
    if (t !== null) {
      var n = nn(t);
      if (n !== null) {
        if (((t = n.tag), t === 13)) {
          if (((t = mu(n)), t !== null)) {
            ((e.blockedOn = t),
              Nu(e.priority, function () {
                _u(n);
              }));
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Hr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = fo(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        ((ql = r), n.target.dispatchEvent(r), (ql = null));
      } else return ((t = hr(n)), t !== null && so(t), (e.blockedOn = n), !1);
      t.shift();
    }
    return !0;
  }
  function Lu(e, t, n) {
    Hr(e) && n.delete(t);
  }
  function Uc() {
    ((ao = !1),
      jt !== null && Hr(jt) && (jt = null),
      Dt !== null && Hr(Dt) && (Dt = null),
      Ft !== null && Hr(Ft) && (Ft = null),
      bn.forEach(Lu),
      er.forEach(Lu));
  }
  function nr(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      ao ||
        ((ao = !0),
        v.unstable_scheduleCallback(v.unstable_NormalPriority, Uc)));
  }
  function rr(e) {
    function t(l) {
      return nr(l, e);
    }
    if (0 < Wr.length) {
      nr(Wr[0], e);
      for (var n = 1; n < Wr.length; n++) {
        var r = Wr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (
      jt !== null && nr(jt, e),
        Dt !== null && nr(Dt, e),
        Ft !== null && nr(Ft, e),
        bn.forEach(t),
        er.forEach(t),
        n = 0;
      n < At.length;
      n++
    )
      ((r = At[n]), r.blockedOn === e && (r.blockedOn = null));
    for (; 0 < At.length && ((n = At[0]), n.blockedOn === null); )
      (Ru(n), n.blockedOn === null && At.shift());
  }
  var kn = pe.ReactCurrentBatchConfig,
    Qr = !0;
  function Vc(e, t, n, r) {
    var l = ie,
      o = kn.transition;
    kn.transition = null;
    try {
      ((ie = 1), co(e, t, n, r));
    } finally {
      ((ie = l), (kn.transition = o));
    }
  }
  function Bc(e, t, n, r) {
    var l = ie,
      o = kn.transition;
    kn.transition = null;
    try {
      ((ie = 4), co(e, t, n, r));
    } finally {
      ((ie = l), (kn.transition = o));
    }
  }
  function co(e, t, n, r) {
    if (Qr) {
      var l = fo(e, t, n, r);
      if (l === null) (Ro(e, t, r, $r, n), Pu(e, r));
      else if (Ac(l, e, t, n, r)) r.stopPropagation();
      else if ((Pu(e, r), t & 4 && -1 < Fc.indexOf(e))) {
        for (; l !== null; ) {
          var o = hr(l);
          if (
            (o !== null && Cu(o),
            (o = fo(e, t, n, r)),
            o === null && Ro(e, t, r, $r, n),
            o === l)
          )
            break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else Ro(e, t, r, null, n);
    }
  }
  var $r = null;
  function fo(e, t, n, r) {
    if ((($r = null), (e = bl(r)), (e = rn(e)), e !== null))
      if (((t = nn(e)), t === null)) e = null;
      else if (((n = t.tag), n === 13)) {
        if (((e = mu(t)), e !== null)) return e;
        e = null;
      } else if (n === 3) {
        if (t.stateNode.current.memoizedState.isDehydrated)
          return t.tag === 3 ? t.stateNode.containerInfo : null;
        e = null;
      } else t !== e && (e = null);
    return (($r = e), null);
  }
  function Tu(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Pc()) {
          case lo:
            return 1;
          case ku:
            return 4;
          case Fr:
          case Rc:
            return 16;
          case xu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Ut = null,
    po = null,
    Gr = null;
  function Mu() {
    if (Gr) return Gr;
    var e,
      t = po,
      n = t.length,
      r,
      l = "value" in Ut ? Ut.value : Ut.textContent,
      o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++);
    var i = n - e;
    for (r = 1; r <= i && t[n - r] === l[o - r]; r++);
    return (Gr = l.slice(e, 1 < r ? 1 - r : void 0));
  }
  function Kr(e) {
    var t = e.keyCode;
    return (
      "charCode" in e
        ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
        : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function Xr() {
    return !0;
  }
  function Iu() {
    return !1;
  }
  function et(e) {
    function t(n, r, l, o, i) {
      ((this._reactName = n),
        (this._targetInst = l),
        (this.type = r),
        (this.nativeEvent = o),
        (this.target = i),
        (this.currentTarget = null));
      for (var u in e)
        e.hasOwnProperty(u) && ((n = e[u]), (this[u] = n ? n(o) : o[u]));
      return (
        (this.isDefaultPrevented = (
          o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1
        )
          ? Xr
          : Iu),
        (this.isPropagationStopped = Iu),
        this
      );
    }
    return (
      R(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var n = this.nativeEvent;
          n &&
            (n.preventDefault
              ? n.preventDefault()
              : typeof n.returnValue != "unknown" && (n.returnValue = !1),
            (this.isDefaultPrevented = Xr));
        },
        stopPropagation: function () {
          var n = this.nativeEvent;
          n &&
            (n.stopPropagation
              ? n.stopPropagation()
              : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
            (this.isPropagationStopped = Xr));
        },
        persist: function () {},
        isPersistent: Xr,
      }),
      t
    );
  }
  var xn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    mo = et(xn),
    lr = R({}, xn, { view: 0, detail: 0 }),
    Wc = et(lr),
    ho,
    go,
    or,
    Yr = R({}, lr, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: yo,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e
          ? e.movementX
          : (e !== or &&
              (or && e.type === "mousemove"
                ? ((ho = e.screenX - or.screenX), (go = e.screenY - or.screenY))
                : (go = ho = 0),
              (or = e)),
            ho);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : go;
      },
    }),
    Ou = et(Yr),
    Hc = R({}, Yr, { dataTransfer: 0 }),
    Qc = et(Hc),
    $c = R({}, lr, { relatedTarget: 0 }),
    vo = et($c),
    Gc = R({}, xn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Kc = et(Gc),
    Xc = R({}, xn, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      },
    }),
    Yc = et(Xc),
    Zc = R({}, xn, { data: 0 }),
    ju = et(Zc),
    Jc = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    qc = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    bc = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function ef(e) {
    var t = this.nativeEvent;
    return t.getModifierState
      ? t.getModifierState(e)
      : (e = bc[e])
        ? !!t[e]
        : !1;
  }
  function yo() {
    return ef;
  }
  var tf = R({}, lr, {
      key: function (e) {
        if (e.key) {
          var t = Jc[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress"
          ? ((e = Kr(e)), e === 13 ? "Enter" : String.fromCharCode(e))
          : e.type === "keydown" || e.type === "keyup"
            ? qc[e.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: yo,
      charCode: function (e) {
        return e.type === "keypress" ? Kr(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress"
          ? Kr(e)
          : e.type === "keydown" || e.type === "keyup"
            ? e.keyCode
            : 0;
      },
    }),
    nf = et(tf),
    rf = R({}, Yr, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Du = et(rf),
    lf = R({}, lr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: yo,
    }),
    of = et(lf),
    uf = R({}, xn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    sf = et(uf),
    af = R({}, Yr, {
      deltaX: function (e) {
        return "deltaX" in e
          ? e.deltaX
          : "wheelDeltaX" in e
            ? -e.wheelDeltaX
            : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e
          ? e.deltaY
          : "wheelDeltaY" in e
            ? -e.wheelDeltaY
            : "wheelDelta" in e
              ? -e.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    cf = et(af),
    ff = [9, 13, 27, 32],
    wo = W && "CompositionEvent" in window,
    ir = null;
  W && "documentMode" in document && (ir = document.documentMode);
  var df = W && "TextEvent" in window && !ir,
    Fu = W && (!wo || (ir && 8 < ir && 11 >= ir)),
    Au = " ",
    Uu = !1;
  function Vu(e, t) {
    switch (e) {
      case "keyup":
        return ff.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Bu(e) {
    return (
      (e = e.detail),
      typeof e == "object" && "data" in e ? e.data : null
    );
  }
  var Sn = !1;
  function pf(e, t) {
    switch (e) {
      case "compositionend":
        return Bu(t);
      case "keypress":
        return t.which !== 32 ? null : ((Uu = !0), Au);
      case "textInput":
        return ((e = t.data), e === Au && Uu ? null : e);
      default:
        return null;
    }
  }
  function mf(e, t) {
    if (Sn)
      return e === "compositionend" || (!wo && Vu(e, t))
        ? ((e = Mu()), (Gr = po = Ut = null), (Sn = !1), e)
        : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Fu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var hf = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Wu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!hf[e.type] : t === "textarea";
  }
  function Hu(e, t, n, r) {
    (au(r),
      (t = el(t, "onChange")),
      0 < t.length &&
        ((n = new mo("onChange", "change", null, n, r)),
        e.push({ event: n, listeners: t })));
  }
  var ur = null,
    sr = null;
  function gf(e) {
    us(e, 0);
  }
  function Zr(e) {
    var t = Nn(e);
    if (tn(t)) return e;
  }
  function vf(e, t) {
    if (e === "change") return t;
  }
  var Qu = !1;
  if (W) {
    var ko;
    if (W) {
      var xo = "oninput" in document;
      if (!xo) {
        var $u = document.createElement("div");
        ($u.setAttribute("oninput", "return;"),
          (xo = typeof $u.oninput == "function"));
      }
      ko = xo;
    } else ko = !1;
    Qu = ko && (!document.documentMode || 9 < document.documentMode);
  }
  function Gu() {
    ur && (ur.detachEvent("onpropertychange", Ku), (sr = ur = null));
  }
  function Ku(e) {
    if (e.propertyName === "value" && Zr(sr)) {
      var t = [];
      (Hu(t, sr, e, bl(e)), pu(gf, t));
    }
  }
  function yf(e, t, n) {
    e === "focusin"
      ? (Gu(), (ur = t), (sr = n), ur.attachEvent("onpropertychange", Ku))
      : e === "focusout" && Gu();
  }
  function wf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Zr(sr);
  }
  function kf(e, t) {
    if (e === "click") return Zr(t);
  }
  function xf(e, t) {
    if (e === "input" || e === "change") return Zr(t);
  }
  function Sf(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var dt = typeof Object.is == "function" ? Object.is : Sf;
  function ar(e, t) {
    if (dt(e, t)) return !0;
    if (
      typeof e != "object" ||
      e === null ||
      typeof t != "object" ||
      t === null
    )
      return !1;
    var n = Object.keys(e),
      r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!P.call(t, l) || !dt(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Xu(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Yu(e, t) {
    var n = Xu(e);
    e = 0;
    for (var r; n; ) {
      if (n.nodeType === 3) {
        if (((r = e + n.textContent.length), e <= t && r >= t))
          return { node: n, offset: t - e };
        e = r;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = Xu(n);
    }
  }
  function Zu(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? Zu(e, t.parentNode)
            : "contains" in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function Ju() {
    for (var e = window, t = Ir(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Ir(e.document);
    }
    return t;
  }
  function So(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === "input" &&
        (e.type === "text" ||
          e.type === "search" ||
          e.type === "tel" ||
          e.type === "url" ||
          e.type === "password")) ||
        t === "textarea" ||
        e.contentEditable === "true")
    );
  }
  function Ef(e) {
    var t = Ju(),
      n = e.focusedElem,
      r = e.selectionRange;
    if (
      t !== n &&
      n &&
      n.ownerDocument &&
      Zu(n.ownerDocument.documentElement, n)
    ) {
      if (r !== null && So(n)) {
        if (
          ((t = r.start),
          (e = r.end),
          e === void 0 && (e = t),
          "selectionStart" in n)
        )
          ((n.selectionStart = t),
            (n.selectionEnd = Math.min(e, n.value.length)));
        else if (
          ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
          e.getSelection)
        ) {
          e = e.getSelection();
          var l = n.textContent.length,
            o = Math.min(r.start, l);
          ((r = r.end === void 0 ? o : Math.min(r.end, l)),
            !e.extend && o > r && ((l = r), (r = o), (o = l)),
            (l = Yu(n, o)));
          var i = Yu(n, r);
          l &&
            i &&
            (e.rangeCount !== 1 ||
              e.anchorNode !== l.node ||
              e.anchorOffset !== l.offset ||
              e.focusNode !== i.node ||
              e.focusOffset !== i.offset) &&
            ((t = t.createRange()),
            t.setStart(l.node, l.offset),
            e.removeAllRanges(),
            o > r
              ? (e.addRange(t), e.extend(i.node, i.offset))
              : (t.setEnd(i.node, i.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; (e = e.parentNode); )
        e.nodeType === 1 &&
          t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
        ((e = t[n]),
          (e.element.scrollLeft = e.left),
          (e.element.scrollTop = e.top));
    }
  }
  var Cf = W && "documentMode" in document && 11 >= document.documentMode,
    En = null,
    Eo = null,
    cr = null,
    Co = !1;
  function qu(e, t, n) {
    var r =
      n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Co ||
      En == null ||
      En !== Ir(r) ||
      ((r = En),
      "selectionStart" in r && So(r)
        ? (r = { start: r.selectionStart, end: r.selectionEnd })
        : ((r = (
            (r.ownerDocument && r.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (r = {
            anchorNode: r.anchorNode,
            anchorOffset: r.anchorOffset,
            focusNode: r.focusNode,
            focusOffset: r.focusOffset,
          })),
      (cr && ar(cr, r)) ||
        ((cr = r),
        (r = el(Eo, "onSelect")),
        0 < r.length &&
          ((t = new mo("onSelect", "select", null, t, n)),
          e.push({ event: t, listeners: r }),
          (t.target = En))));
  }
  function Jr(e, t) {
    var n = {};
    return (
      (n[e.toLowerCase()] = t.toLowerCase()),
      (n["Webkit" + e] = "webkit" + t),
      (n["Moz" + e] = "moz" + t),
      n
    );
  }
  var Cn = {
      animationend: Jr("Animation", "AnimationEnd"),
      animationiteration: Jr("Animation", "AnimationIteration"),
      animationstart: Jr("Animation", "AnimationStart"),
      transitionend: Jr("Transition", "TransitionEnd"),
    },
    _o = {},
    bu = {};
  W &&
    ((bu = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete Cn.animationend.animation,
      delete Cn.animationiteration.animation,
      delete Cn.animationstart.animation),
    "TransitionEvent" in window || delete Cn.transitionend.transition);
  function qr(e) {
    if (_o[e]) return _o[e];
    if (!Cn[e]) return e;
    var t = Cn[e],
      n;
    for (n in t) if (t.hasOwnProperty(n) && n in bu) return (_o[e] = t[n]);
    return e;
  }
  var es = qr("animationend"),
    ts = qr("animationiteration"),
    ns = qr("animationstart"),
    rs = qr("transitionend"),
    ls = new Map(),
    os =
      "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  function Vt(e, t) {
    (ls.set(e, t), _(t, [e]));
  }
  for (var zo = 0; zo < os.length; zo++) {
    var No = os[zo],
      _f = No.toLowerCase(),
      zf = No[0].toUpperCase() + No.slice(1);
    Vt(_f, "on" + zf);
  }
  (Vt(es, "onAnimationEnd"),
    Vt(ts, "onAnimationIteration"),
    Vt(ns, "onAnimationStart"),
    Vt("dblclick", "onDoubleClick"),
    Vt("focusin", "onFocus"),
    Vt("focusout", "onBlur"),
    Vt(rs, "onTransitionEnd"),
    N("onMouseEnter", ["mouseout", "mouseover"]),
    N("onMouseLeave", ["mouseout", "mouseover"]),
    N("onPointerEnter", ["pointerout", "pointerover"]),
    N("onPointerLeave", ["pointerout", "pointerover"]),
    _(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " ",
      ),
    ),
    _(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    _("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    _(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" "),
    ),
    _(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    _(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ));
  var fr =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    Nf = new Set(
      "cancel close invalid load scroll toggle".split(" ").concat(fr),
    );
  function is(e, t, n) {
    var r = e.type || "unknown-event";
    ((e.currentTarget = n), Cc(r, t, void 0, e), (e.currentTarget = null));
  }
  function us(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n],
        l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t)
          for (var i = r.length - 1; 0 <= i; i--) {
            var u = r[i],
              a = u.instance,
              h = u.currentTarget;
            if (((u = u.listener), a !== o && l.isPropagationStopped()))
              break e;
            (is(l, u, h), (o = a));
          }
        else
          for (i = 0; i < r.length; i++) {
            if (
              ((u = r[i]),
              (a = u.instance),
              (h = u.currentTarget),
              (u = u.listener),
              a !== o && l.isPropagationStopped())
            )
              break e;
            (is(l, u, h), (o = a));
          }
      }
    }
    if (Dr) throw ((e = ro), (Dr = !1), (ro = null), e);
  }
  function ae(e, t) {
    var n = t[jo];
    n === void 0 && (n = t[jo] = new Set());
    var r = e + "__bubble";
    n.has(r) || (ss(t, e, 2, !1), n.add(r));
  }
  function Po(e, t, n) {
    var r = 0;
    (t && (r |= 4), ss(n, e, r, t));
  }
  var br = "_reactListening" + Math.random().toString(36).slice(2);
  function dr(e) {
    if (!e[br]) {
      ((e[br] = !0),
        x.forEach(function (n) {
          n !== "selectionchange" && (Nf.has(n) || Po(n, !1, e), Po(n, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[br] || ((t[br] = !0), Po("selectionchange", !1, t));
    }
  }
  function ss(e, t, n, r) {
    switch (Tu(t)) {
      case 1:
        var l = Vc;
        break;
      case 4:
        l = Bc;
        break;
      default:
        l = co;
    }
    ((n = l.bind(null, t, n, e)),
      (l = void 0),
      !no ||
        (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
        (l = !0),
      r
        ? l !== void 0
          ? e.addEventListener(t, n, { capture: !0, passive: l })
          : e.addEventListener(t, n, !0)
        : l !== void 0
          ? e.addEventListener(t, n, { passive: l })
          : e.addEventListener(t, n, !1));
  }
  function Ro(e, t, n, r, l) {
    var o = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null)
      e: for (;;) {
        if (r === null) return;
        var i = r.tag;
        if (i === 3 || i === 4) {
          var u = r.stateNode.containerInfo;
          if (u === l || (u.nodeType === 8 && u.parentNode === l)) break;
          if (i === 4)
            for (i = r.return; i !== null; ) {
              var a = i.tag;
              if (
                (a === 3 || a === 4) &&
                ((a = i.stateNode.containerInfo),
                a === l || (a.nodeType === 8 && a.parentNode === l))
              )
                return;
              i = i.return;
            }
          for (; u !== null; ) {
            if (((i = rn(u)), i === null)) return;
            if (((a = i.tag), a === 5 || a === 6)) {
              r = o = i;
              continue e;
            }
            u = u.parentNode;
          }
        }
        r = r.return;
      }
    pu(function () {
      var h = o,
        k = bl(n),
        S = [];
      e: {
        var w = ls.get(e);
        if (w !== void 0) {
          var z = mo,
            T = e;
          switch (e) {
            case "keypress":
              if (Kr(n) === 0) break e;
            case "keydown":
            case "keyup":
              z = nf;
              break;
            case "focusin":
              ((T = "focus"), (z = vo));
              break;
            case "focusout":
              ((T = "blur"), (z = vo));
              break;
            case "beforeblur":
            case "afterblur":
              z = vo;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              z = Ou;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              z = Qc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              z = of;
              break;
            case es:
            case ts:
            case ns:
              z = Kc;
              break;
            case rs:
              z = sf;
              break;
            case "scroll":
              z = Wc;
              break;
            case "wheel":
              z = cf;
              break;
            case "copy":
            case "cut":
            case "paste":
              z = Yc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              z = Du;
          }
          var O = (t & 4) !== 0,
            we = !O && e === "scroll",
            p = O ? (w !== null ? w + "Capture" : null) : w;
          O = [];
          for (var f = h, m; f !== null; ) {
            m = f;
            var E = m.stateNode;
            if (
              (m.tag === 5 &&
                E !== null &&
                ((m = E),
                p !== null &&
                  ((E = Xn(f, p)), E != null && O.push(pr(f, E, m)))),
              we)
            )
              break;
            f = f.return;
          }
          0 < O.length &&
            ((w = new z(w, T, null, n, k)), S.push({ event: w, listeners: O }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((w = e === "mouseover" || e === "pointerover"),
            (z = e === "mouseout" || e === "pointerout"),
            w &&
              n !== ql &&
              (T = n.relatedTarget || n.fromElement) &&
              (rn(T) || T[Ct]))
          )
            break e;
          if (
            (z || w) &&
            ((w =
              k.window === k
                ? k
                : (w = k.ownerDocument)
                  ? w.defaultView || w.parentWindow
                  : window),
            z
              ? ((T = n.relatedTarget || n.toElement),
                (z = h),
                (T = T ? rn(T) : null),
                T !== null &&
                  ((we = nn(T)), T !== we || (T.tag !== 5 && T.tag !== 6)) &&
                  (T = null))
              : ((z = null), (T = h)),
            z !== T)
          ) {
            if (
              ((O = Ou),
              (E = "onMouseLeave"),
              (p = "onMouseEnter"),
              (f = "mouse"),
              (e === "pointerout" || e === "pointerover") &&
                ((O = Du),
                (E = "onPointerLeave"),
                (p = "onPointerEnter"),
                (f = "pointer")),
              (we = z == null ? w : Nn(z)),
              (m = T == null ? w : Nn(T)),
              (w = new O(E, f + "leave", z, n, k)),
              (w.target = we),
              (w.relatedTarget = m),
              (E = null),
              rn(k) === h &&
                ((O = new O(p, f + "enter", T, n, k)),
                (O.target = m),
                (O.relatedTarget = we),
                (E = O)),
              (we = E),
              z && T)
            )
              t: {
                for (O = z, p = T, f = 0, m = O; m; m = _n(m)) f++;
                for (m = 0, E = p; E; E = _n(E)) m++;
                for (; 0 < f - m; ) ((O = _n(O)), f--);
                for (; 0 < m - f; ) ((p = _n(p)), m--);
                for (; f--; ) {
                  if (O === p || (p !== null && O === p.alternate)) break t;
                  ((O = _n(O)), (p = _n(p)));
                }
                O = null;
              }
            else O = null;
            (z !== null && as(S, w, z, O, !1),
              T !== null && we !== null && as(S, we, T, O, !0));
          }
        }
        e: {
          if (
            ((w = h ? Nn(h) : window),
            (z = w.nodeName && w.nodeName.toLowerCase()),
            z === "select" || (z === "input" && w.type === "file"))
          )
            var j = vf;
          else if (Wu(w))
            if (Qu) j = xf;
            else {
              j = wf;
              var U = yf;
            }
          else
            (z = w.nodeName) &&
              z.toLowerCase() === "input" &&
              (w.type === "checkbox" || w.type === "radio") &&
              (j = kf);
          if (j && (j = j(e, h))) {
            Hu(S, j, n, k);
            break e;
          }
          (U && U(e, w, h),
            e === "focusout" &&
              (U = w._wrapperState) &&
              U.controlled &&
              w.type === "number" &&
              Kl(w, "number", w.value));
        }
        switch (((U = h ? Nn(h) : window), e)) {
          case "focusin":
            (Wu(U) || U.contentEditable === "true") &&
              ((En = U), (Eo = h), (cr = null));
            break;
          case "focusout":
            cr = Eo = En = null;
            break;
          case "mousedown":
            Co = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((Co = !1), qu(S, n, k));
            break;
          case "selectionchange":
            if (Cf) break;
          case "keydown":
          case "keyup":
            qu(S, n, k);
        }
        var V;
        if (wo)
          e: {
            switch (e) {
              case "compositionstart":
                var H = "onCompositionStart";
                break e;
              case "compositionend":
                H = "onCompositionEnd";
                break e;
              case "compositionupdate":
                H = "onCompositionUpdate";
                break e;
            }
            H = void 0;
          }
        else
          Sn
            ? Vu(e, n) && (H = "onCompositionEnd")
            : e === "keydown" &&
              n.keyCode === 229 &&
              (H = "onCompositionStart");
        (H &&
          (Fu &&
            n.locale !== "ko" &&
            (Sn || H !== "onCompositionStart"
              ? H === "onCompositionEnd" && Sn && (V = Mu())
              : ((Ut = k),
                (po = "value" in Ut ? Ut.value : Ut.textContent),
                (Sn = !0))),
          (U = el(h, H)),
          0 < U.length &&
            ((H = new ju(H, e, null, n, k)),
            S.push({ event: H, listeners: U }),
            V ? (H.data = V) : ((V = Bu(n)), V !== null && (H.data = V)))),
          (V = df ? pf(e, n) : mf(e, n)) &&
            ((h = el(h, "onBeforeInput")),
            0 < h.length &&
              ((k = new ju("onBeforeInput", "beforeinput", null, n, k)),
              S.push({ event: k, listeners: h }),
              (k.data = V))));
      }
      us(S, t);
    });
  }
  function pr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function el(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e,
        o = l.stateNode;
      (l.tag === 5 &&
        o !== null &&
        ((l = o),
        (o = Xn(e, n)),
        o != null && r.unshift(pr(e, o, l)),
        (o = Xn(e, t)),
        o != null && r.push(pr(e, o, l))),
        (e = e.return));
    }
    return r;
  }
  function _n(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function as(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var u = n,
        a = u.alternate,
        h = u.stateNode;
      if (a !== null && a === r) break;
      (u.tag === 5 &&
        h !== null &&
        ((u = h),
        l
          ? ((a = Xn(n, o)), a != null && i.unshift(pr(n, a, u)))
          : l || ((a = Xn(n, o)), a != null && i.push(pr(n, a, u)))),
        (n = n.return));
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var Pf = /\r\n?/g,
    Rf = /\u0000|\uFFFD/g;
  function cs(e) {
    return (typeof e == "string" ? e : "" + e)
      .replace(
        Pf,
        `
`,
      )
      .replace(Rf, "");
  }
  function tl(e, t, n) {
    if (((t = cs(t)), cs(e) !== t && n)) throw Error(c(425));
  }
  function nl() {}
  var Lo = null,
    To = null;
  function Mo(e, t) {
    return (
      e === "textarea" ||
      e === "noscript" ||
      typeof t.children == "string" ||
      typeof t.children == "number" ||
      (typeof t.dangerouslySetInnerHTML == "object" &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Io = typeof setTimeout == "function" ? setTimeout : void 0,
    Lf = typeof clearTimeout == "function" ? clearTimeout : void 0,
    fs = typeof Promise == "function" ? Promise : void 0,
    Tf =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof fs < "u"
          ? function (e) {
              return fs.resolve(null).then(e).catch(Mf);
            }
          : Io;
  function Mf(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function Oo(e, t) {
    var n = t,
      r = 0;
    do {
      var l = n.nextSibling;
      if ((e.removeChild(n), l && l.nodeType === 8))
        if (((n = l.data), n === "/$")) {
          if (r === 0) {
            (e.removeChild(l), rr(t));
            return;
          }
          r--;
        } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
      n = l;
    } while (n);
    rr(t);
  }
  function Bt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function ds(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (t === 0) return e;
          t--;
        } else n === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var zn = Math.random().toString(36).slice(2),
    kt = "__reactFiber$" + zn,
    mr = "__reactProps$" + zn,
    Ct = "__reactContainer$" + zn,
    jo = "__reactEvents$" + zn,
    If = "__reactListeners$" + zn,
    Of = "__reactHandles$" + zn;
  function rn(e) {
    var t = e[kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if ((t = n[Ct] || n[kt])) {
        if (
          ((n = t.alternate),
          t.child !== null || (n !== null && n.child !== null))
        )
          for (e = ds(e); e !== null; ) {
            if ((n = e[kt])) return n;
            e = ds(e);
          }
        return t;
      }
      ((e = n), (n = e.parentNode));
    }
    return null;
  }
  function hr(e) {
    return (
      (e = e[kt] || e[Ct]),
      !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3)
        ? null
        : e
    );
  }
  function Nn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(c(33));
  }
  function rl(e) {
    return e[mr] || null;
  }
  var Do = [],
    Pn = -1;
  function Wt(e) {
    return { current: e };
  }
  function ce(e) {
    0 > Pn || ((e.current = Do[Pn]), (Do[Pn] = null), Pn--);
  }
  function ue(e, t) {
    (Pn++, (Do[Pn] = e.current), (e.current = t));
  }
  var Ht = {},
    Ue = Wt(Ht),
    Xe = Wt(!1),
    ln = Ht;
  function Rn(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Ht;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
      return r.__reactInternalMemoizedMaskedChildContext;
    var l = {},
      o;
    for (o in n) l[o] = t[o];
    return (
      r &&
        ((e = e.stateNode),
        (e.__reactInternalMemoizedUnmaskedChildContext = t),
        (e.__reactInternalMemoizedMaskedChildContext = l)),
      l
    );
  }
  function Ye(e) {
    return ((e = e.childContextTypes), e != null);
  }
  function ll() {
    (ce(Xe), ce(Ue));
  }
  function ps(e, t, n) {
    if (Ue.current !== Ht) throw Error(c(168));
    (ue(Ue, t), ue(Xe, n));
  }
  function ms(e, t, n) {
    var r = e.stateNode;
    if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
      return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(c(108, Q(e) || "Unknown", l));
    return R({}, n, r);
  }
  function ol(e) {
    return (
      (e =
        ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) ||
        Ht),
      (ln = Ue.current),
      ue(Ue, e),
      ue(Xe, Xe.current),
      !0
    );
  }
  function hs(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(c(169));
    (n
      ? ((e = ms(e, t, ln)),
        (r.__reactInternalMemoizedMergedChildContext = e),
        ce(Xe),
        ce(Ue),
        ue(Ue, e))
      : ce(Xe),
      ue(Xe, n));
  }
  var _t = null,
    il = !1,
    Fo = !1;
  function gs(e) {
    _t === null ? (_t = [e]) : _t.push(e);
  }
  function jf(e) {
    ((il = !0), gs(e));
  }
  function Qt() {
    if (!Fo && _t !== null) {
      Fo = !0;
      var e = 0,
        t = ie;
      try {
        var n = _t;
        for (ie = 1; e < n.length; e++) {
          var r = n[e];
          do r = r(!0);
          while (r !== null);
        }
        ((_t = null), (il = !1));
      } catch (l) {
        throw (_t !== null && (_t = _t.slice(e + 1)), yu(lo, Qt), l);
      } finally {
        ((ie = t), (Fo = !1));
      }
    }
    return null;
  }
  var Ln = [],
    Tn = 0,
    ul = null,
    sl = 0,
    ot = [],
    it = 0,
    on = null,
    zt = 1,
    Nt = "";
  function un(e, t) {
    ((Ln[Tn++] = sl), (Ln[Tn++] = ul), (ul = e), (sl = t));
  }
  function vs(e, t, n) {
    ((ot[it++] = zt), (ot[it++] = Nt), (ot[it++] = on), (on = e));
    var r = zt;
    e = Nt;
    var l = 32 - ft(r) - 1;
    ((r &= ~(1 << l)), (n += 1));
    var o = 32 - ft(t) + l;
    if (30 < o) {
      var i = l - (l % 5);
      ((o = (r & ((1 << i) - 1)).toString(32)),
        (r >>= i),
        (l -= i),
        (zt = (1 << (32 - ft(t) + l)) | (n << l) | r),
        (Nt = o + e));
    } else ((zt = (1 << o) | (n << l) | r), (Nt = e));
  }
  function Ao(e) {
    e.return !== null && (un(e, 1), vs(e, 1, 0));
  }
  function Uo(e) {
    for (; e === ul; )
      ((ul = Ln[--Tn]), (Ln[Tn] = null), (sl = Ln[--Tn]), (Ln[Tn] = null));
    for (; e === on; )
      ((on = ot[--it]),
        (ot[it] = null),
        (Nt = ot[--it]),
        (ot[it] = null),
        (zt = ot[--it]),
        (ot[it] = null));
  }
  var tt = null,
    nt = null,
    de = !1,
    pt = null;
  function ys(e, t) {
    var n = ct(5, null, null, 0);
    ((n.elementType = "DELETED"),
      (n.stateNode = t),
      (n.return = e),
      (t = e.deletions),
      t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
  }
  function ws(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return (
          (t =
            t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
              ? null
              : t),
          t !== null
            ? ((e.stateNode = t), (tt = e), (nt = Bt(t.firstChild)), !0)
            : !1
        );
      case 6:
        return (
          (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
          t !== null ? ((e.stateNode = t), (tt = e), (nt = null), !0) : !1
        );
      case 13:
        return (
          (t = t.nodeType !== 8 ? null : t),
          t !== null
            ? ((n = on !== null ? { id: zt, overflow: Nt } : null),
              (e.memoizedState = {
                dehydrated: t,
                treeContext: n,
                retryLane: 1073741824,
              }),
              (n = ct(18, null, null, 0)),
              (n.stateNode = t),
              (n.return = e),
              (e.child = n),
              (tt = e),
              (nt = null),
              !0)
            : !1
        );
      default:
        return !1;
    }
  }
  function Vo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Bo(e) {
    if (de) {
      var t = nt;
      if (t) {
        var n = t;
        if (!ws(e, t)) {
          if (Vo(e)) throw Error(c(418));
          t = Bt(n.nextSibling);
          var r = tt;
          t && ws(e, t)
            ? ys(r, n)
            : ((e.flags = (e.flags & -4097) | 2), (de = !1), (tt = e));
        }
      } else {
        if (Vo(e)) throw Error(c(418));
        ((e.flags = (e.flags & -4097) | 2), (de = !1), (tt = e));
      }
    }
  }
  function ks(e) {
    for (
      e = e.return;
      e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;
    )
      e = e.return;
    tt = e;
  }
  function al(e) {
    if (e !== tt) return !1;
    if (!de) return (ks(e), (de = !0), !1);
    var t;
    if (
      ((t = e.tag !== 3) &&
        !(t = e.tag !== 5) &&
        ((t = e.type),
        (t = t !== "head" && t !== "body" && !Mo(e.type, e.memoizedProps))),
      t && (t = nt))
    ) {
      if (Vo(e)) throw (xs(), Error(c(418)));
      for (; t; ) (ys(e, t), (t = Bt(t.nextSibling)));
    }
    if ((ks(e), e.tag === 13)) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
        throw Error(c(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                nt = Bt(e.nextSibling);
                break e;
              }
              t--;
            } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
          }
          e = e.nextSibling;
        }
        nt = null;
      }
    } else nt = tt ? Bt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function xs() {
    for (var e = nt; e; ) e = Bt(e.nextSibling);
  }
  function Mn() {
    ((nt = tt = null), (de = !1));
  }
  function Wo(e) {
    pt === null ? (pt = [e]) : pt.push(e);
  }
  var Df = pe.ReactCurrentBatchConfig;
  function gr(e, t, n) {
    if (
      ((e = n.ref),
      e !== null && typeof e != "function" && typeof e != "object")
    ) {
      if (n._owner) {
        if (((n = n._owner), n)) {
          if (n.tag !== 1) throw Error(c(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(c(147, e));
        var l = r,
          o = "" + e;
        return t !== null &&
          t.ref !== null &&
          typeof t.ref == "function" &&
          t.ref._stringRef === o
          ? t.ref
          : ((t = function (i) {
              var u = l.refs;
              i === null ? delete u[o] : (u[o] = i);
            }),
            (t._stringRef = o),
            t);
      }
      if (typeof e != "string") throw Error(c(284));
      if (!n._owner) throw Error(c(290, e));
    }
    return e;
  }
  function cl(e, t) {
    throw (
      (e = Object.prototype.toString.call(t)),
      Error(
        c(
          31,
          e === "[object Object]"
            ? "object with keys {" + Object.keys(t).join(", ") + "}"
            : e,
        ),
      )
    );
  }
  function Ss(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Es(e) {
    function t(p, f) {
      if (e) {
        var m = p.deletions;
        m === null ? ((p.deletions = [f]), (p.flags |= 16)) : m.push(f);
      }
    }
    function n(p, f) {
      if (!e) return null;
      for (; f !== null; ) (t(p, f), (f = f.sibling));
      return null;
    }
    function r(p, f) {
      for (p = new Map(); f !== null; )
        (f.key !== null ? p.set(f.key, f) : p.set(f.index, f), (f = f.sibling));
      return p;
    }
    function l(p, f) {
      return ((p = qt(p, f)), (p.index = 0), (p.sibling = null), p);
    }
    function o(p, f, m) {
      return (
        (p.index = m),
        e
          ? ((m = p.alternate),
            m !== null
              ? ((m = m.index), m < f ? ((p.flags |= 2), f) : m)
              : ((p.flags |= 2), f))
          : ((p.flags |= 1048576), f)
      );
    }
    function i(p) {
      return (e && p.alternate === null && (p.flags |= 2), p);
    }
    function u(p, f, m, E) {
      return f === null || f.tag !== 6
        ? ((f = Ii(m, p.mode, E)), (f.return = p), f)
        : ((f = l(f, m)), (f.return = p), f);
    }
    function a(p, f, m, E) {
      var j = m.type;
      return j === ke
        ? k(p, f, m.props.children, E, m.key)
        : f !== null &&
            (f.elementType === j ||
              (typeof j == "object" &&
                j !== null &&
                j.$$typeof === fe &&
                Ss(j) === f.type))
          ? ((E = l(f, m.props)), (E.ref = gr(p, f, m)), (E.return = p), E)
          : ((E = Ol(m.type, m.key, m.props, null, p.mode, E)),
            (E.ref = gr(p, f, m)),
            (E.return = p),
            E);
    }
    function h(p, f, m, E) {
      return f === null ||
        f.tag !== 4 ||
        f.stateNode.containerInfo !== m.containerInfo ||
        f.stateNode.implementation !== m.implementation
        ? ((f = Oi(m, p.mode, E)), (f.return = p), f)
        : ((f = l(f, m.children || [])), (f.return = p), f);
    }
    function k(p, f, m, E, j) {
      return f === null || f.tag !== 7
        ? ((f = hn(m, p.mode, E, j)), (f.return = p), f)
        : ((f = l(f, m)), (f.return = p), f);
    }
    function S(p, f, m) {
      if ((typeof f == "string" && f !== "") || typeof f == "number")
        return ((f = Ii("" + f, p.mode, m)), (f.return = p), f);
      if (typeof f == "object" && f !== null) {
        switch (f.$$typeof) {
          case Ne:
            return (
              (m = Ol(f.type, f.key, f.props, null, p.mode, m)),
              (m.ref = gr(p, null, f)),
              (m.return = p),
              m
            );
          case me:
            return ((f = Oi(f, p.mode, m)), (f.return = p), f);
          case fe:
            var E = f._init;
            return S(p, E(f._payload), m);
        }
        if ($n(f) || A(f))
          return ((f = hn(f, p.mode, m, null)), (f.return = p), f);
        cl(p, f);
      }
      return null;
    }
    function w(p, f, m, E) {
      var j = f !== null ? f.key : null;
      if ((typeof m == "string" && m !== "") || typeof m == "number")
        return j !== null ? null : u(p, f, "" + m, E);
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case Ne:
            return m.key === j ? a(p, f, m, E) : null;
          case me:
            return m.key === j ? h(p, f, m, E) : null;
          case fe:
            return ((j = m._init), w(p, f, j(m._payload), E));
        }
        if ($n(m) || A(m)) return j !== null ? null : k(p, f, m, E, null);
        cl(p, m);
      }
      return null;
    }
    function z(p, f, m, E, j) {
      if ((typeof E == "string" && E !== "") || typeof E == "number")
        return ((p = p.get(m) || null), u(f, p, "" + E, j));
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case Ne:
            return (
              (p = p.get(E.key === null ? m : E.key) || null),
              a(f, p, E, j)
            );
          case me:
            return (
              (p = p.get(E.key === null ? m : E.key) || null),
              h(f, p, E, j)
            );
          case fe:
            var U = E._init;
            return z(p, f, m, U(E._payload), j);
        }
        if ($n(E) || A(E)) return ((p = p.get(m) || null), k(f, p, E, j, null));
        cl(f, E);
      }
      return null;
    }
    function T(p, f, m, E) {
      for (
        var j = null, U = null, V = f, H = (f = 0), Me = null;
        V !== null && H < m.length;
        H++
      ) {
        V.index > H ? ((Me = V), (V = null)) : (Me = V.sibling);
        var ne = w(p, V, m[H], E);
        if (ne === null) {
          V === null && (V = Me);
          break;
        }
        (e && V && ne.alternate === null && t(p, V),
          (f = o(ne, f, H)),
          U === null ? (j = ne) : (U.sibling = ne),
          (U = ne),
          (V = Me));
      }
      if (H === m.length) return (n(p, V), de && un(p, H), j);
      if (V === null) {
        for (; H < m.length; H++)
          ((V = S(p, m[H], E)),
            V !== null &&
              ((f = o(V, f, H)),
              U === null ? (j = V) : (U.sibling = V),
              (U = V)));
        return (de && un(p, H), j);
      }
      for (V = r(p, V); H < m.length; H++)
        ((Me = z(V, p, H, m[H], E)),
          Me !== null &&
            (e &&
              Me.alternate !== null &&
              V.delete(Me.key === null ? H : Me.key),
            (f = o(Me, f, H)),
            U === null ? (j = Me) : (U.sibling = Me),
            (U = Me)));
      return (
        e &&
          V.forEach(function (bt) {
            return t(p, bt);
          }),
        de && un(p, H),
        j
      );
    }
    function O(p, f, m, E) {
      var j = A(m);
      if (typeof j != "function") throw Error(c(150));
      if (((m = j.call(m)), m == null)) throw Error(c(151));
      for (
        var U = (j = null), V = f, H = (f = 0), Me = null, ne = m.next();
        V !== null && !ne.done;
        H++, ne = m.next()
      ) {
        V.index > H ? ((Me = V), (V = null)) : (Me = V.sibling);
        var bt = w(p, V, ne.value, E);
        if (bt === null) {
          V === null && (V = Me);
          break;
        }
        (e && V && bt.alternate === null && t(p, V),
          (f = o(bt, f, H)),
          U === null ? (j = bt) : (U.sibling = bt),
          (U = bt),
          (V = Me));
      }
      if (ne.done) return (n(p, V), de && un(p, H), j);
      if (V === null) {
        for (; !ne.done; H++, ne = m.next())
          ((ne = S(p, ne.value, E)),
            ne !== null &&
              ((f = o(ne, f, H)),
              U === null ? (j = ne) : (U.sibling = ne),
              (U = ne)));
        return (de && un(p, H), j);
      }
      for (V = r(p, V); !ne.done; H++, ne = m.next())
        ((ne = z(V, p, H, ne.value, E)),
          ne !== null &&
            (e &&
              ne.alternate !== null &&
              V.delete(ne.key === null ? H : ne.key),
            (f = o(ne, f, H)),
            U === null ? (j = ne) : (U.sibling = ne),
            (U = ne)));
      return (
        e &&
          V.forEach(function (hd) {
            return t(p, hd);
          }),
        de && un(p, H),
        j
      );
    }
    function we(p, f, m, E) {
      if (
        (typeof m == "object" &&
          m !== null &&
          m.type === ke &&
          m.key === null &&
          (m = m.props.children),
        typeof m == "object" && m !== null)
      ) {
        switch (m.$$typeof) {
          case Ne:
            e: {
              for (var j = m.key, U = f; U !== null; ) {
                if (U.key === j) {
                  if (((j = m.type), j === ke)) {
                    if (U.tag === 7) {
                      (n(p, U.sibling),
                        (f = l(U, m.props.children)),
                        (f.return = p),
                        (p = f));
                      break e;
                    }
                  } else if (
                    U.elementType === j ||
                    (typeof j == "object" &&
                      j !== null &&
                      j.$$typeof === fe &&
                      Ss(j) === U.type)
                  ) {
                    (n(p, U.sibling),
                      (f = l(U, m.props)),
                      (f.ref = gr(p, U, m)),
                      (f.return = p),
                      (p = f));
                    break e;
                  }
                  n(p, U);
                  break;
                } else t(p, U);
                U = U.sibling;
              }
              m.type === ke
                ? ((f = hn(m.props.children, p.mode, E, m.key)),
                  (f.return = p),
                  (p = f))
                : ((E = Ol(m.type, m.key, m.props, null, p.mode, E)),
                  (E.ref = gr(p, f, m)),
                  (E.return = p),
                  (p = E));
            }
            return i(p);
          case me:
            e: {
              for (U = m.key; f !== null; ) {
                if (f.key === U)
                  if (
                    f.tag === 4 &&
                    f.stateNode.containerInfo === m.containerInfo &&
                    f.stateNode.implementation === m.implementation
                  ) {
                    (n(p, f.sibling),
                      (f = l(f, m.children || [])),
                      (f.return = p),
                      (p = f));
                    break e;
                  } else {
                    n(p, f);
                    break;
                  }
                else t(p, f);
                f = f.sibling;
              }
              ((f = Oi(m, p.mode, E)), (f.return = p), (p = f));
            }
            return i(p);
          case fe:
            return ((U = m._init), we(p, f, U(m._payload), E));
        }
        if ($n(m)) return T(p, f, m, E);
        if (A(m)) return O(p, f, m, E);
        cl(p, m);
      }
      return (typeof m == "string" && m !== "") || typeof m == "number"
        ? ((m = "" + m),
          f !== null && f.tag === 6
            ? (n(p, f.sibling), (f = l(f, m)), (f.return = p), (p = f))
            : (n(p, f), (f = Ii(m, p.mode, E)), (f.return = p), (p = f)),
          i(p))
        : n(p, f);
    }
    return we;
  }
  var In = Es(!0),
    Cs = Es(!1),
    fl = Wt(null),
    dl = null,
    On = null,
    Ho = null;
  function Qo() {
    Ho = On = dl = null;
  }
  function $o(e) {
    var t = fl.current;
    (ce(fl), (e._currentValue = t));
  }
  function Go(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
          : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
        e === n)
      )
        break;
      e = e.return;
    }
  }
  function jn(e, t) {
    ((dl = e),
      (Ho = On = null),
      (e = e.dependencies),
      e !== null &&
        e.firstContext !== null &&
        ((e.lanes & t) !== 0 && (Ze = !0), (e.firstContext = null)));
  }
  function ut(e) {
    var t = e._currentValue;
    if (Ho !== e)
      if (((e = { context: e, memoizedValue: t, next: null }), On === null)) {
        if (dl === null) throw Error(c(308));
        ((On = e), (dl.dependencies = { lanes: 0, firstContext: e }));
      } else On = On.next = e;
    return t;
  }
  var sn = null;
  function Ko(e) {
    sn === null ? (sn = [e]) : sn.push(e);
  }
  function _s(e, t, n, r) {
    var l = t.interleaved;
    return (
      l === null ? ((n.next = n), Ko(t)) : ((n.next = l.next), (l.next = n)),
      (t.interleaved = n),
      Pt(e, r)
    );
  }
  function Pt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
      ((e.childLanes |= t),
        (n = e.alternate),
        n !== null && (n.childLanes |= t),
        (n = e),
        (e = e.return));
    return n.tag === 3 ? n.stateNode : null;
  }
  var $t = !1;
  function Xo(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, interleaved: null, lanes: 0 },
      effects: null,
    };
  }
  function zs(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          effects: e.effects,
        }));
  }
  function Rt(e, t) {
    return {
      eventTime: e,
      lane: t,
      tag: 0,
      payload: null,
      callback: null,
      next: null,
    };
  }
  function Gt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (((r = r.shared), (b & 2) !== 0)) {
      var l = r.pending;
      return (
        l === null ? (t.next = t) : ((t.next = l.next), (l.next = t)),
        (r.pending = t),
        Pt(e, n)
      );
    }
    return (
      (l = r.interleaved),
      l === null ? ((t.next = t), Ko(r)) : ((t.next = l.next), (l.next = t)),
      (r.interleaved = t),
      Pt(e, n)
    );
  }
  function pl(e, t, n) {
    if (
      ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
    ) {
      var r = t.lanes;
      ((r &= e.pendingLanes), (n |= r), (t.lanes = n), uo(e, n));
    }
  }
  function Ns(e, t) {
    var n = e.updateQueue,
      r = e.alternate;
    if (r !== null && ((r = r.updateQueue), n === r)) {
      var l = null,
        o = null;
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var i = {
            eventTime: n.eventTime,
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: n.callback,
            next: null,
          };
          (o === null ? (l = o = i) : (o = o.next = i), (n = n.next));
        } while (n !== null);
        o === null ? (l = o = t) : (o = o.next = t);
      } else l = o = t;
      ((n = {
        baseState: r.baseState,
        firstBaseUpdate: l,
        lastBaseUpdate: o,
        shared: r.shared,
        effects: r.effects,
      }),
        (e.updateQueue = n));
      return;
    }
    ((e = n.lastBaseUpdate),
      e === null ? (n.firstBaseUpdate = t) : (e.next = t),
      (n.lastBaseUpdate = t));
  }
  function ml(e, t, n, r) {
    var l = e.updateQueue;
    $t = !1;
    var o = l.firstBaseUpdate,
      i = l.lastBaseUpdate,
      u = l.shared.pending;
    if (u !== null) {
      l.shared.pending = null;
      var a = u,
        h = a.next;
      ((a.next = null), i === null ? (o = h) : (i.next = h), (i = a));
      var k = e.alternate;
      k !== null &&
        ((k = k.updateQueue),
        (u = k.lastBaseUpdate),
        u !== i &&
          (u === null ? (k.firstBaseUpdate = h) : (u.next = h),
          (k.lastBaseUpdate = a)));
    }
    if (o !== null) {
      var S = l.baseState;
      ((i = 0), (k = h = a = null), (u = o));
      do {
        var w = u.lane,
          z = u.eventTime;
        if ((r & w) === w) {
          k !== null &&
            (k = k.next =
              {
                eventTime: z,
                lane: 0,
                tag: u.tag,
                payload: u.payload,
                callback: u.callback,
                next: null,
              });
          e: {
            var T = e,
              O = u;
            switch (((w = t), (z = n), O.tag)) {
              case 1:
                if (((T = O.payload), typeof T == "function")) {
                  S = T.call(z, S, w);
                  break e;
                }
                S = T;
                break e;
              case 3:
                T.flags = (T.flags & -65537) | 128;
              case 0:
                if (
                  ((T = O.payload),
                  (w = typeof T == "function" ? T.call(z, S, w) : T),
                  w == null)
                )
                  break e;
                S = R({}, S, w);
                break e;
              case 2:
                $t = !0;
            }
          }
          u.callback !== null &&
            u.lane !== 0 &&
            ((e.flags |= 64),
            (w = l.effects),
            w === null ? (l.effects = [u]) : w.push(u));
        } else
          ((z = {
            eventTime: z,
            lane: w,
            tag: u.tag,
            payload: u.payload,
            callback: u.callback,
            next: null,
          }),
            k === null ? ((h = k = z), (a = S)) : (k = k.next = z),
            (i |= w));
        if (((u = u.next), u === null)) {
          if (((u = l.shared.pending), u === null)) break;
          ((w = u),
            (u = w.next),
            (w.next = null),
            (l.lastBaseUpdate = w),
            (l.shared.pending = null));
        }
      } while (!0);
      if (
        (k === null && (a = S),
        (l.baseState = a),
        (l.firstBaseUpdate = h),
        (l.lastBaseUpdate = k),
        (t = l.shared.interleaved),
        t !== null)
      ) {
        l = t;
        do ((i |= l.lane), (l = l.next));
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      ((fn |= i), (e.lanes = i), (e.memoizedState = S));
    }
  }
  function Ps(e, t, n) {
    if (((e = t.effects), (t.effects = null), e !== null))
      for (t = 0; t < e.length; t++) {
        var r = e[t],
          l = r.callback;
        if (l !== null) {
          if (((r.callback = null), (r = n), typeof l != "function"))
            throw Error(c(191, l));
          l.call(r);
        }
      }
  }
  var vr = {},
    xt = Wt(vr),
    yr = Wt(vr),
    wr = Wt(vr);
  function an(e) {
    if (e === vr) throw Error(c(174));
    return e;
  }
  function Yo(e, t) {
    switch ((ue(wr, t), ue(yr, e), ue(xt, vr), (e = t.nodeType), e)) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Yl(null, "");
        break;
      default:
        ((e = e === 8 ? t.parentNode : t),
          (t = e.namespaceURI || null),
          (e = e.tagName),
          (t = Yl(t, e)));
    }
    (ce(xt), ue(xt, t));
  }
  function Dn() {
    (ce(xt), ce(yr), ce(wr));
  }
  function Rs(e) {
    an(wr.current);
    var t = an(xt.current),
      n = Yl(t, e.type);
    t !== n && (ue(yr, e), ue(xt, n));
  }
  function Zo(e) {
    yr.current === e && (ce(xt), ce(yr));
  }
  var he = Wt(0);
  function hl(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (
          n !== null &&
          ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
        )
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var Jo = [];
  function qo() {
    for (var e = 0; e < Jo.length; e++)
      Jo[e]._workInProgressVersionPrimary = null;
    Jo.length = 0;
  }
  var gl = pe.ReactCurrentDispatcher,
    bo = pe.ReactCurrentBatchConfig,
    cn = 0,
    ge = null,
    Ee = null,
    Le = null,
    vl = !1,
    kr = !1,
    xr = 0,
    Ff = 0;
  function Ve() {
    throw Error(c(321));
  }
  function ei(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!dt(e[n], t[n])) return !1;
    return !0;
  }
  function ti(e, t, n, r, l, o) {
    if (
      ((cn = o),
      (ge = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (gl.current = e === null || e.memoizedState === null ? Bf : Wf),
      (e = n(r, l)),
      kr)
    ) {
      o = 0;
      do {
        if (((kr = !1), (xr = 0), 25 <= o)) throw Error(c(301));
        ((o += 1),
          (Le = Ee = null),
          (t.updateQueue = null),
          (gl.current = Hf),
          (e = n(r, l)));
      } while (kr);
    }
    if (
      ((gl.current = kl),
      (t = Ee !== null && Ee.next !== null),
      (cn = 0),
      (Le = Ee = ge = null),
      (vl = !1),
      t)
    )
      throw Error(c(300));
    return e;
  }
  function ni() {
    var e = xr !== 0;
    return ((xr = 0), e);
  }
  function St() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return (Le === null ? (ge.memoizedState = Le = e) : (Le = Le.next = e), Le);
  }
  function st() {
    if (Ee === null) {
      var e = ge.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ee.next;
    var t = Le === null ? ge.memoizedState : Le.next;
    if (t !== null) ((Le = t), (Ee = e));
    else {
      if (e === null) throw Error(c(310));
      ((Ee = e),
        (e = {
          memoizedState: Ee.memoizedState,
          baseState: Ee.baseState,
          baseQueue: Ee.baseQueue,
          queue: Ee.queue,
          next: null,
        }),
        Le === null ? (ge.memoizedState = Le = e) : (Le = Le.next = e));
    }
    return Le;
  }
  function Sr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ri(e) {
    var t = st(),
      n = t.queue;
    if (n === null) throw Error(c(311));
    n.lastRenderedReducer = e;
    var r = Ee,
      l = r.baseQueue,
      o = n.pending;
    if (o !== null) {
      if (l !== null) {
        var i = l.next;
        ((l.next = o.next), (o.next = i));
      }
      ((r.baseQueue = l = o), (n.pending = null));
    }
    if (l !== null) {
      ((o = l.next), (r = r.baseState));
      var u = (i = null),
        a = null,
        h = o;
      do {
        var k = h.lane;
        if ((cn & k) === k)
          (a !== null &&
            (a = a.next =
              {
                lane: 0,
                action: h.action,
                hasEagerState: h.hasEagerState,
                eagerState: h.eagerState,
                next: null,
              }),
            (r = h.hasEagerState ? h.eagerState : e(r, h.action)));
        else {
          var S = {
            lane: k,
            action: h.action,
            hasEagerState: h.hasEagerState,
            eagerState: h.eagerState,
            next: null,
          };
          (a === null ? ((u = a = S), (i = r)) : (a = a.next = S),
            (ge.lanes |= k),
            (fn |= k));
        }
        h = h.next;
      } while (h !== null && h !== o);
      (a === null ? (i = r) : (a.next = u),
        dt(r, t.memoizedState) || (Ze = !0),
        (t.memoizedState = r),
        (t.baseState = i),
        (t.baseQueue = a),
        (n.lastRenderedState = r));
    }
    if (((e = n.interleaved), e !== null)) {
      l = e;
      do ((o = l.lane), (ge.lanes |= o), (fn |= o), (l = l.next));
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function li(e) {
    var t = st(),
      n = t.queue;
    if (n === null) throw Error(c(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch,
      l = n.pending,
      o = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var i = (l = l.next);
      do ((o = e(o, i.action)), (i = i.next));
      while (i !== l);
      (dt(o, t.memoizedState) || (Ze = !0),
        (t.memoizedState = o),
        t.baseQueue === null && (t.baseState = o),
        (n.lastRenderedState = o));
    }
    return [o, r];
  }
  function Ls() {}
  function Ts(e, t) {
    var n = ge,
      r = st(),
      l = t(),
      o = !dt(r.memoizedState, l);
    if (
      (o && ((r.memoizedState = l), (Ze = !0)),
      (r = r.queue),
      oi(Os.bind(null, n, r, e), [e]),
      r.getSnapshot !== t || o || (Le !== null && Le.memoizedState.tag & 1))
    ) {
      if (
        ((n.flags |= 2048),
        Er(9, Is.bind(null, n, r, l, t), void 0, null),
        Te === null)
      )
        throw Error(c(349));
      (cn & 30) !== 0 || Ms(n, t, l);
    }
    return l;
  }
  function Ms(e, t, n) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: n }),
      (t = ge.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }),
          (ge.updateQueue = t),
          (t.stores = [e]))
        : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
  }
  function Is(e, t, n, r) {
    ((t.value = n), (t.getSnapshot = r), js(t) && Ds(e));
  }
  function Os(e, t, n) {
    return n(function () {
      js(t) && Ds(e);
    });
  }
  function js(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !dt(e, n);
    } catch {
      return !0;
    }
  }
  function Ds(e) {
    var t = Pt(e, 1);
    t !== null && vt(t, e, 1, -1);
  }
  function Fs(e) {
    var t = St();
    return (
      typeof e == "function" && (e = e()),
      (t.memoizedState = t.baseState = e),
      (e = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Sr,
        lastRenderedState: e,
      }),
      (t.queue = e),
      (e = e.dispatch = Vf.bind(null, ge, e)),
      [t.memoizedState, e]
    );
  }
  function Er(e, t, n, r) {
    return (
      (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
      (t = ge.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }),
          (ge.updateQueue = t),
          (t.lastEffect = e.next = e))
        : ((n = t.lastEffect),
          n === null
            ? (t.lastEffect = e.next = e)
            : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
      e
    );
  }
  function As() {
    return st().memoizedState;
  }
  function yl(e, t, n, r) {
    var l = St();
    ((ge.flags |= e),
      (l.memoizedState = Er(1 | t, n, void 0, r === void 0 ? null : r)));
  }
  function wl(e, t, n, r) {
    var l = st();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (Ee !== null) {
      var i = Ee.memoizedState;
      if (((o = i.destroy), r !== null && ei(r, i.deps))) {
        l.memoizedState = Er(t, n, o, r);
        return;
      }
    }
    ((ge.flags |= e), (l.memoizedState = Er(1 | t, n, o, r)));
  }
  function Us(e, t) {
    return yl(8390656, 8, e, t);
  }
  function oi(e, t) {
    return wl(2048, 8, e, t);
  }
  function Vs(e, t) {
    return wl(4, 2, e, t);
  }
  function Bs(e, t) {
    return wl(4, 4, e, t);
  }
  function Ws(e, t) {
    if (typeof t == "function")
      return (
        (e = e()),
        t(e),
        function () {
          t(null);
        }
      );
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function Hs(e, t, n) {
    return (
      (n = n != null ? n.concat([e]) : null),
      wl(4, 4, Ws.bind(null, t, e), n)
    );
  }
  function ii() {}
  function Qs(e, t) {
    var n = st();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && ei(t, r[1])
      ? r[0]
      : ((n.memoizedState = [e, t]), e);
  }
  function $s(e, t) {
    var n = st();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && ei(t, r[1])
      ? r[0]
      : ((e = e()), (n.memoizedState = [e, t]), e);
  }
  function Gs(e, t, n) {
    return (cn & 21) === 0
      ? (e.baseState && ((e.baseState = !1), (Ze = !0)), (e.memoizedState = n))
      : (dt(n, t) ||
          ((n = Su()), (ge.lanes |= n), (fn |= n), (e.baseState = !0)),
        t);
  }
  function Af(e, t) {
    var n = ie;
    ((ie = n !== 0 && 4 > n ? n : 4), e(!0));
    var r = bo.transition;
    bo.transition = {};
    try {
      (e(!1), t());
    } finally {
      ((ie = n), (bo.transition = r));
    }
  }
  function Ks() {
    return st().memoizedState;
  }
  function Uf(e, t, n) {
    var r = Zt(e);
    if (
      ((n = {
        lane: r,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      Xs(e))
    )
      Ys(t, n);
    else if (((n = _s(e, t, n, r)), n !== null)) {
      var l = Ke();
      (vt(n, e, r, l), Zs(n, t, r));
    }
  }
  function Vf(e, t, n) {
    var r = Zt(e),
      l = {
        lane: r,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
    if (Xs(e)) Ys(t, l);
    else {
      var o = e.alternate;
      if (
        e.lanes === 0 &&
        (o === null || o.lanes === 0) &&
        ((o = t.lastRenderedReducer), o !== null)
      )
        try {
          var i = t.lastRenderedState,
            u = o(i, n);
          if (((l.hasEagerState = !0), (l.eagerState = u), dt(u, i))) {
            var a = t.interleaved;
            (a === null
              ? ((l.next = l), Ko(t))
              : ((l.next = a.next), (a.next = l)),
              (t.interleaved = l));
            return;
          }
        } catch {
        } finally {
        }
      ((n = _s(e, t, l, r)),
        n !== null && ((l = Ke()), vt(n, e, r, l), Zs(n, t, r)));
    }
  }
  function Xs(e) {
    var t = e.alternate;
    return e === ge || (t !== null && t === ge);
  }
  function Ys(e, t) {
    kr = vl = !0;
    var n = e.pending;
    (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
      (e.pending = t));
  }
  function Zs(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      ((r &= e.pendingLanes), (n |= r), (t.lanes = n), uo(e, n));
    }
  }
  var kl = {
      readContext: ut,
      useCallback: Ve,
      useContext: Ve,
      useEffect: Ve,
      useImperativeHandle: Ve,
      useInsertionEffect: Ve,
      useLayoutEffect: Ve,
      useMemo: Ve,
      useReducer: Ve,
      useRef: Ve,
      useState: Ve,
      useDebugValue: Ve,
      useDeferredValue: Ve,
      useTransition: Ve,
      useMutableSource: Ve,
      useSyncExternalStore: Ve,
      useId: Ve,
      unstable_isNewReconciler: !1,
    },
    Bf = {
      readContext: ut,
      useCallback: function (e, t) {
        return ((St().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: ut,
      useEffect: Us,
      useImperativeHandle: function (e, t, n) {
        return (
          (n = n != null ? n.concat([e]) : null),
          yl(4194308, 4, Ws.bind(null, t, e), n)
        );
      },
      useLayoutEffect: function (e, t) {
        return yl(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        return yl(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var n = St();
        return (
          (t = t === void 0 ? null : t),
          (e = e()),
          (n.memoizedState = [e, t]),
          e
        );
      },
      useReducer: function (e, t, n) {
        var r = St();
        return (
          (t = n !== void 0 ? n(t) : t),
          (r.memoizedState = r.baseState = t),
          (e = {
            pending: null,
            interleaved: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: t,
          }),
          (r.queue = e),
          (e = e.dispatch = Uf.bind(null, ge, e)),
          [r.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = St();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: Fs,
      useDebugValue: ii,
      useDeferredValue: function (e) {
        return (St().memoizedState = e);
      },
      useTransition: function () {
        var e = Fs(!1),
          t = e[0];
        return ((e = Af.bind(null, e[1])), (St().memoizedState = e), [t, e]);
      },
      useMutableSource: function () {},
      useSyncExternalStore: function (e, t, n) {
        var r = ge,
          l = St();
        if (de) {
          if (n === void 0) throw Error(c(407));
          n = n();
        } else {
          if (((n = t()), Te === null)) throw Error(c(349));
          (cn & 30) !== 0 || Ms(r, t, n);
        }
        l.memoizedState = n;
        var o = { value: n, getSnapshot: t };
        return (
          (l.queue = o),
          Us(Os.bind(null, r, o, e), [e]),
          (r.flags |= 2048),
          Er(9, Is.bind(null, r, o, n, t), void 0, null),
          n
        );
      },
      useId: function () {
        var e = St(),
          t = Te.identifierPrefix;
        if (de) {
          var n = Nt,
            r = zt;
          ((n = (r & ~(1 << (32 - ft(r) - 1))).toString(32) + n),
            (t = ":" + t + "R" + n),
            (n = xr++),
            0 < n && (t += "H" + n.toString(32)),
            (t += ":"));
        } else ((n = Ff++), (t = ":" + t + "r" + n.toString(32) + ":"));
        return (e.memoizedState = t);
      },
      unstable_isNewReconciler: !1,
    },
    Wf = {
      readContext: ut,
      useCallback: Qs,
      useContext: ut,
      useEffect: oi,
      useImperativeHandle: Hs,
      useInsertionEffect: Vs,
      useLayoutEffect: Bs,
      useMemo: $s,
      useReducer: ri,
      useRef: As,
      useState: function () {
        return ri(Sr);
      },
      useDebugValue: ii,
      useDeferredValue: function (e) {
        var t = st();
        return Gs(t, Ee.memoizedState, e);
      },
      useTransition: function () {
        var e = ri(Sr)[0],
          t = st().memoizedState;
        return [e, t];
      },
      useMutableSource: Ls,
      useSyncExternalStore: Ts,
      useId: Ks,
      unstable_isNewReconciler: !1,
    },
    Hf = {
      readContext: ut,
      useCallback: Qs,
      useContext: ut,
      useEffect: oi,
      useImperativeHandle: Hs,
      useInsertionEffect: Vs,
      useLayoutEffect: Bs,
      useMemo: $s,
      useReducer: li,
      useRef: As,
      useState: function () {
        return li(Sr);
      },
      useDebugValue: ii,
      useDeferredValue: function (e) {
        var t = st();
        return Ee === null ? (t.memoizedState = e) : Gs(t, Ee.memoizedState, e);
      },
      useTransition: function () {
        var e = li(Sr)[0],
          t = st().memoizedState;
        return [e, t];
      },
      useMutableSource: Ls,
      useSyncExternalStore: Ts,
      useId: Ks,
      unstable_isNewReconciler: !1,
    };
  function mt(e, t) {
    if (e && e.defaultProps) {
      ((t = R({}, t)), (e = e.defaultProps));
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function ui(e, t, n, r) {
    ((t = e.memoizedState),
      (n = n(r, t)),
      (n = n == null ? t : R({}, t, n)),
      (e.memoizedState = n),
      e.lanes === 0 && (e.updateQueue.baseState = n));
  }
  var xl = {
    isMounted: function (e) {
      return (e = e._reactInternals) ? nn(e) === e : !1;
    },
    enqueueSetState: function (e, t, n) {
      e = e._reactInternals;
      var r = Ke(),
        l = Zt(e),
        o = Rt(r, l);
      ((o.payload = t),
        n != null && (o.callback = n),
        (t = Gt(e, o, l)),
        t !== null && (vt(t, e, l, r), pl(t, e, l)));
    },
    enqueueReplaceState: function (e, t, n) {
      e = e._reactInternals;
      var r = Ke(),
        l = Zt(e),
        o = Rt(r, l);
      ((o.tag = 1),
        (o.payload = t),
        n != null && (o.callback = n),
        (t = Gt(e, o, l)),
        t !== null && (vt(t, e, l, r), pl(t, e, l)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var n = Ke(),
        r = Zt(e),
        l = Rt(n, r);
      ((l.tag = 2),
        t != null && (l.callback = t),
        (t = Gt(e, l, r)),
        t !== null && (vt(t, e, r, n), pl(t, e, r)));
    },
  };
  function Js(e, t, n, r, l, o, i) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == "function"
        ? e.shouldComponentUpdate(r, o, i)
        : t.prototype && t.prototype.isPureReactComponent
          ? !ar(n, r) || !ar(l, o)
          : !0
    );
  }
  function qs(e, t, n) {
    var r = !1,
      l = Ht,
      o = t.contextType;
    return (
      typeof o == "object" && o !== null
        ? (o = ut(o))
        : ((l = Ye(t) ? ln : Ue.current),
          (r = t.contextTypes),
          (o = (r = r != null) ? Rn(e, l) : Ht)),
      (t = new t(n, o)),
      (e.memoizedState =
        t.state !== null && t.state !== void 0 ? t.state : null),
      (t.updater = xl),
      (e.stateNode = t),
      (t._reactInternals = e),
      r &&
        ((e = e.stateNode),
        (e.__reactInternalMemoizedUnmaskedChildContext = l),
        (e.__reactInternalMemoizedMaskedChildContext = o)),
      t
    );
  }
  function bs(e, t, n, r) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == "function" &&
        t.componentWillReceiveProps(n, r),
      typeof t.UNSAFE_componentWillReceiveProps == "function" &&
        t.UNSAFE_componentWillReceiveProps(n, r),
      t.state !== e && xl.enqueueReplaceState(t, t.state, null));
  }
  function si(e, t, n, r) {
    var l = e.stateNode;
    ((l.props = n), (l.state = e.memoizedState), (l.refs = {}), Xo(e));
    var o = t.contextType;
    (typeof o == "object" && o !== null
      ? (l.context = ut(o))
      : ((o = Ye(t) ? ln : Ue.current), (l.context = Rn(e, o))),
      (l.state = e.memoizedState),
      (o = t.getDerivedStateFromProps),
      typeof o == "function" && (ui(e, t, o, n), (l.state = e.memoizedState)),
      typeof t.getDerivedStateFromProps == "function" ||
        typeof l.getSnapshotBeforeUpdate == "function" ||
        (typeof l.UNSAFE_componentWillMount != "function" &&
          typeof l.componentWillMount != "function") ||
        ((t = l.state),
        typeof l.componentWillMount == "function" && l.componentWillMount(),
        typeof l.UNSAFE_componentWillMount == "function" &&
          l.UNSAFE_componentWillMount(),
        t !== l.state && xl.enqueueReplaceState(l, l.state, null),
        ml(e, n, l, r),
        (l.state = e.memoizedState)),
      typeof l.componentDidMount == "function" && (e.flags |= 4194308));
  }
  function Fn(e, t) {
    try {
      var n = "",
        r = t;
      do ((n += K(r)), (r = r.return));
      while (r);
      var l = n;
    } catch (o) {
      l =
        `
Error generating stack: ` +
        o.message +
        `
` +
        o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function ai(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function ci(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function () {
        throw n;
      });
    }
  }
  var Qf = typeof WeakMap == "function" ? WeakMap : Map;
  function ea(e, t, n) {
    ((n = Rt(-1, n)), (n.tag = 3), (n.payload = { element: null }));
    var r = t.value;
    return (
      (n.callback = function () {
        (Pl || ((Pl = !0), (_i = r)), ci(e, t));
      }),
      n
    );
  }
  function ta(e, t, n) {
    ((n = Rt(-1, n)), (n.tag = 3));
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      ((n.payload = function () {
        return r(l);
      }),
        (n.callback = function () {
          ci(e, t);
        }));
    }
    var o = e.stateNode;
    return (
      o !== null &&
        typeof o.componentDidCatch == "function" &&
        (n.callback = function () {
          (ci(e, t),
            typeof r != "function" &&
              (Xt === null ? (Xt = new Set([this])) : Xt.add(this)));
          var i = t.stack;
          this.componentDidCatch(t.value, {
            componentStack: i !== null ? i : "",
          });
        }),
      n
    );
  }
  function na(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Qf();
      var l = new Set();
      r.set(t, l);
    } else ((l = r.get(t)), l === void 0 && ((l = new Set()), r.set(t, l)));
    l.has(n) || (l.add(n), (e = ld.bind(null, e, t, n)), t.then(e, e));
  }
  function ra(e) {
    do {
      var t;
      if (
        ((t = e.tag === 13) &&
          ((t = e.memoizedState),
          (t = t !== null ? t.dehydrated !== null : !0)),
        t)
      )
        return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function la(e, t, n, r, l) {
    return (e.mode & 1) === 0
      ? (e === t
          ? (e.flags |= 65536)
          : ((e.flags |= 128),
            (n.flags |= 131072),
            (n.flags &= -52805),
            n.tag === 1 &&
              (n.alternate === null
                ? (n.tag = 17)
                : ((t = Rt(-1, 1)), (t.tag = 2), Gt(n, t, 1))),
            (n.lanes |= 1)),
        e)
      : ((e.flags |= 65536), (e.lanes = l), e);
  }
  var $f = pe.ReactCurrentOwner,
    Ze = !1;
  function Ge(e, t, n, r) {
    t.child = e === null ? Cs(t, null, n, r) : In(t, e.child, n, r);
  }
  function oa(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return (
      jn(t, l),
      (r = ti(e, t, n, r, o, l)),
      (n = ni()),
      e !== null && !Ze
        ? ((t.updateQueue = e.updateQueue),
          (t.flags &= -2053),
          (e.lanes &= ~l),
          Lt(e, t, l))
        : (de && n && Ao(t), (t.flags |= 1), Ge(e, t, r, l), t.child)
    );
  }
  function ia(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" &&
        !Mi(o) &&
        o.defaultProps === void 0 &&
        n.compare === null &&
        n.defaultProps === void 0
        ? ((t.tag = 15), (t.type = o), ua(e, t, o, r, l))
        : ((e = Ol(n.type, null, r, t, t.mode, l)),
          (e.ref = t.ref),
          (e.return = t),
          (t.child = e));
    }
    if (((o = e.child), (e.lanes & l) === 0)) {
      var i = o.memoizedProps;
      if (
        ((n = n.compare), (n = n !== null ? n : ar), n(i, r) && e.ref === t.ref)
      )
        return Lt(e, t, l);
    }
    return (
      (t.flags |= 1),
      (e = qt(o, r)),
      (e.ref = t.ref),
      (e.return = t),
      (t.child = e)
    );
  }
  function ua(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (ar(o, r) && e.ref === t.ref)
        if (((Ze = !1), (t.pendingProps = r = o), (e.lanes & l) !== 0))
          (e.flags & 131072) !== 0 && (Ze = !0);
        else return ((t.lanes = e.lanes), Lt(e, t, l));
    }
    return fi(e, t, n, r, l);
  }
  function sa(e, t, n) {
    var r = t.pendingProps,
      l = r.children,
      o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden")
      if ((t.mode & 1) === 0)
        ((t.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null,
        }),
          ue(Un, rt),
          (rt |= n));
      else {
        if ((n & 1073741824) === 0)
          return (
            (e = o !== null ? o.baseLanes | n : n),
            (t.lanes = t.childLanes = 1073741824),
            (t.memoizedState = {
              baseLanes: e,
              cachePool: null,
              transitions: null,
            }),
            (t.updateQueue = null),
            ue(Un, rt),
            (rt |= e),
            null
          );
        ((t.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null,
        }),
          (r = o !== null ? o.baseLanes : n),
          ue(Un, rt),
          (rt |= r));
      }
    else
      (o !== null ? ((r = o.baseLanes | n), (t.memoizedState = null)) : (r = n),
        ue(Un, rt),
        (rt |= r));
    return (Ge(e, t, l, n), t.child);
  }
  function aa(e, t) {
    var n = t.ref;
    ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
      ((t.flags |= 512), (t.flags |= 2097152));
  }
  function fi(e, t, n, r, l) {
    var o = Ye(n) ? ln : Ue.current;
    return (
      (o = Rn(t, o)),
      jn(t, l),
      (n = ti(e, t, n, r, o, l)),
      (r = ni()),
      e !== null && !Ze
        ? ((t.updateQueue = e.updateQueue),
          (t.flags &= -2053),
          (e.lanes &= ~l),
          Lt(e, t, l))
        : (de && r && Ao(t), (t.flags |= 1), Ge(e, t, n, l), t.child)
    );
  }
  function ca(e, t, n, r, l) {
    if (Ye(n)) {
      var o = !0;
      ol(t);
    } else o = !1;
    if ((jn(t, l), t.stateNode === null))
      (El(e, t), qs(t, n, r), si(t, n, r, l), (r = !0));
    else if (e === null) {
      var i = t.stateNode,
        u = t.memoizedProps;
      i.props = u;
      var a = i.context,
        h = n.contextType;
      typeof h == "object" && h !== null
        ? (h = ut(h))
        : ((h = Ye(n) ? ln : Ue.current), (h = Rn(t, h)));
      var k = n.getDerivedStateFromProps,
        S =
          typeof k == "function" ||
          typeof i.getSnapshotBeforeUpdate == "function";
      (S ||
        (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
          typeof i.componentWillReceiveProps != "function") ||
        ((u !== r || a !== h) && bs(t, i, r, h)),
        ($t = !1));
      var w = t.memoizedState;
      ((i.state = w),
        ml(t, r, i, l),
        (a = t.memoizedState),
        u !== r || w !== a || Xe.current || $t
          ? (typeof k == "function" && (ui(t, n, k, r), (a = t.memoizedState)),
            (u = $t || Js(t, n, u, r, w, a, h))
              ? (S ||
                  (typeof i.UNSAFE_componentWillMount != "function" &&
                    typeof i.componentWillMount != "function") ||
                  (typeof i.componentWillMount == "function" &&
                    i.componentWillMount(),
                  typeof i.UNSAFE_componentWillMount == "function" &&
                    i.UNSAFE_componentWillMount()),
                typeof i.componentDidMount == "function" &&
                  (t.flags |= 4194308))
              : (typeof i.componentDidMount == "function" &&
                  (t.flags |= 4194308),
                (t.memoizedProps = r),
                (t.memoizedState = a)),
            (i.props = r),
            (i.state = a),
            (i.context = h),
            (r = u))
          : (typeof i.componentDidMount == "function" && (t.flags |= 4194308),
            (r = !1)));
    } else {
      ((i = t.stateNode),
        zs(e, t),
        (u = t.memoizedProps),
        (h = t.type === t.elementType ? u : mt(t.type, u)),
        (i.props = h),
        (S = t.pendingProps),
        (w = i.context),
        (a = n.contextType),
        typeof a == "object" && a !== null
          ? (a = ut(a))
          : ((a = Ye(n) ? ln : Ue.current), (a = Rn(t, a))));
      var z = n.getDerivedStateFromProps;
      ((k =
        typeof z == "function" ||
        typeof i.getSnapshotBeforeUpdate == "function") ||
        (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
          typeof i.componentWillReceiveProps != "function") ||
        ((u !== S || w !== a) && bs(t, i, r, a)),
        ($t = !1),
        (w = t.memoizedState),
        (i.state = w),
        ml(t, r, i, l));
      var T = t.memoizedState;
      u !== S || w !== T || Xe.current || $t
        ? (typeof z == "function" && (ui(t, n, z, r), (T = t.memoizedState)),
          (h = $t || Js(t, n, h, r, w, T, a) || !1)
            ? (k ||
                (typeof i.UNSAFE_componentWillUpdate != "function" &&
                  typeof i.componentWillUpdate != "function") ||
                (typeof i.componentWillUpdate == "function" &&
                  i.componentWillUpdate(r, T, a),
                typeof i.UNSAFE_componentWillUpdate == "function" &&
                  i.UNSAFE_componentWillUpdate(r, T, a)),
              typeof i.componentDidUpdate == "function" && (t.flags |= 4),
              typeof i.getSnapshotBeforeUpdate == "function" &&
                (t.flags |= 1024))
            : (typeof i.componentDidUpdate != "function" ||
                (u === e.memoizedProps && w === e.memoizedState) ||
                (t.flags |= 4),
              typeof i.getSnapshotBeforeUpdate != "function" ||
                (u === e.memoizedProps && w === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = r),
              (t.memoizedState = T)),
          (i.props = r),
          (i.state = T),
          (i.context = a),
          (r = h))
        : (typeof i.componentDidUpdate != "function" ||
            (u === e.memoizedProps && w === e.memoizedState) ||
            (t.flags |= 4),
          typeof i.getSnapshotBeforeUpdate != "function" ||
            (u === e.memoizedProps && w === e.memoizedState) ||
            (t.flags |= 1024),
          (r = !1));
    }
    return di(e, t, n, r, o, l);
  }
  function di(e, t, n, r, l, o) {
    aa(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return (l && hs(t, n, !1), Lt(e, t, o));
    ((r = t.stateNode), ($f.current = t));
    var u =
      i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return (
      (t.flags |= 1),
      e !== null && i
        ? ((t.child = In(t, e.child, null, o)), (t.child = In(t, null, u, o)))
        : Ge(e, t, u, o),
      (t.memoizedState = r.state),
      l && hs(t, n, !0),
      t.child
    );
  }
  function fa(e) {
    var t = e.stateNode;
    (t.pendingContext
      ? ps(e, t.pendingContext, t.pendingContext !== t.context)
      : t.context && ps(e, t.context, !1),
      Yo(e, t.containerInfo));
  }
  function da(e, t, n, r, l) {
    return (Mn(), Wo(l), (t.flags |= 256), Ge(e, t, n, r), t.child);
  }
  var pi = { dehydrated: null, treeContext: null, retryLane: 0 };
  function mi(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function pa(e, t, n) {
    var r = t.pendingProps,
      l = he.current,
      o = !1,
      i = (t.flags & 128) !== 0,
      u;
    if (
      ((u = i) ||
        (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0),
      u
        ? ((o = !0), (t.flags &= -129))
        : (e === null || e.memoizedState !== null) && (l |= 1),
      ue(he, l & 1),
      e === null)
    )
      return (
        Bo(t),
        (e = t.memoizedState),
        e !== null && ((e = e.dehydrated), e !== null)
          ? ((t.mode & 1) === 0
              ? (t.lanes = 1)
              : e.data === "$!"
                ? (t.lanes = 8)
                : (t.lanes = 1073741824),
            null)
          : ((i = r.children),
            (e = r.fallback),
            o
              ? ((r = t.mode),
                (o = t.child),
                (i = { mode: "hidden", children: i }),
                (r & 1) === 0 && o !== null
                  ? ((o.childLanes = 0), (o.pendingProps = i))
                  : (o = jl(i, r, 0, null)),
                (e = hn(e, r, n, null)),
                (o.return = t),
                (e.return = t),
                (o.sibling = e),
                (t.child = o),
                (t.child.memoizedState = mi(n)),
                (t.memoizedState = pi),
                e)
              : hi(t, i))
      );
    if (((l = e.memoizedState), l !== null && ((u = l.dehydrated), u !== null)))
      return Gf(e, t, i, r, u, l, n);
    if (o) {
      ((o = r.fallback), (i = t.mode), (l = e.child), (u = l.sibling));
      var a = { mode: "hidden", children: r.children };
      return (
        (i & 1) === 0 && t.child !== l
          ? ((r = t.child),
            (r.childLanes = 0),
            (r.pendingProps = a),
            (t.deletions = null))
          : ((r = qt(l, a)), (r.subtreeFlags = l.subtreeFlags & 14680064)),
        u !== null ? (o = qt(u, o)) : ((o = hn(o, i, n, null)), (o.flags |= 2)),
        (o.return = t),
        (r.return = t),
        (r.sibling = o),
        (t.child = r),
        (r = o),
        (o = t.child),
        (i = e.child.memoizedState),
        (i =
          i === null
            ? mi(n)
            : {
                baseLanes: i.baseLanes | n,
                cachePool: null,
                transitions: i.transitions,
              }),
        (o.memoizedState = i),
        (o.childLanes = e.childLanes & ~n),
        (t.memoizedState = pi),
        r
      );
    }
    return (
      (o = e.child),
      (e = o.sibling),
      (r = qt(o, { mode: "visible", children: r.children })),
      (t.mode & 1) === 0 && (r.lanes = n),
      (r.return = t),
      (r.sibling = null),
      e !== null &&
        ((n = t.deletions),
        n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
      (t.child = r),
      (t.memoizedState = null),
      r
    );
  }
  function hi(e, t) {
    return (
      (t = jl({ mode: "visible", children: t }, e.mode, 0, null)),
      (t.return = e),
      (e.child = t)
    );
  }
  function Sl(e, t, n, r) {
    return (
      r !== null && Wo(r),
      In(t, e.child, null, n),
      (e = hi(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function Gf(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256
        ? ((t.flags &= -257), (r = ai(Error(c(422)))), Sl(e, t, i, r))
        : t.memoizedState !== null
          ? ((t.child = e.child), (t.flags |= 128), null)
          : ((o = r.fallback),
            (l = t.mode),
            (r = jl({ mode: "visible", children: r.children }, l, 0, null)),
            (o = hn(o, l, i, null)),
            (o.flags |= 2),
            (r.return = t),
            (o.return = t),
            (r.sibling = o),
            (t.child = r),
            (t.mode & 1) !== 0 && In(t, e.child, null, i),
            (t.child.memoizedState = mi(i)),
            (t.memoizedState = pi),
            o);
    if ((t.mode & 1) === 0) return Sl(e, t, i, null);
    if (l.data === "$!") {
      if (((r = l.nextSibling && l.nextSibling.dataset), r)) var u = r.dgst;
      return (
        (r = u),
        (o = Error(c(419))),
        (r = ai(o, r, void 0)),
        Sl(e, t, i, r)
      );
    }
    if (((u = (i & e.childLanes) !== 0), Ze || u)) {
      if (((r = Te), r !== null)) {
        switch (i & -i) {
          case 4:
            l = 2;
            break;
          case 16:
            l = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            l = 32;
            break;
          case 536870912:
            l = 268435456;
            break;
          default:
            l = 0;
        }
        ((l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l),
          l !== 0 &&
            l !== o.retryLane &&
            ((o.retryLane = l), Pt(e, l), vt(r, e, l, -1)));
      }
      return (Ti(), (r = ai(Error(c(421)))), Sl(e, t, i, r));
    }
    return l.data === "$?"
      ? ((t.flags |= 128),
        (t.child = e.child),
        (t = od.bind(null, e)),
        (l._reactRetry = t),
        null)
      : ((e = o.treeContext),
        (nt = Bt(l.nextSibling)),
        (tt = t),
        (de = !0),
        (pt = null),
        e !== null &&
          ((ot[it++] = zt),
          (ot[it++] = Nt),
          (ot[it++] = on),
          (zt = e.id),
          (Nt = e.overflow),
          (on = t)),
        (t = hi(t, r.children)),
        (t.flags |= 4096),
        t);
  }
  function ma(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    (r !== null && (r.lanes |= t), Go(e.return, t, n));
  }
  function gi(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: r,
          tail: n,
          tailMode: l,
        })
      : ((o.isBackwards = t),
        (o.rendering = null),
        (o.renderingStartTime = 0),
        (o.last = r),
        (o.tail = n),
        (o.tailMode = l));
  }
  function ha(e, t, n) {
    var r = t.pendingProps,
      l = r.revealOrder,
      o = r.tail;
    if ((Ge(e, t, r.children, n), (r = he.current), (r & 2) !== 0))
      ((r = (r & 1) | 2), (t.flags |= 128));
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13) e.memoizedState !== null && ma(e, n, t);
          else if (e.tag === 19) ma(e, n, t);
          else if (e.child !== null) {
            ((e.child.return = e), (e = e.child));
            continue;
          }
          if (e === t) break e;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) break e;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      r &= 1;
    }
    if ((ue(he, r), (t.mode & 1) === 0)) t.memoizedState = null;
    else
      switch (l) {
        case "forwards":
          for (n = t.child, l = null; n !== null; )
            ((e = n.alternate),
              e !== null && hl(e) === null && (l = n),
              (n = n.sibling));
          ((n = l),
            n === null
              ? ((l = t.child), (t.child = null))
              : ((l = n.sibling), (n.sibling = null)),
            gi(t, !1, l, n, o));
          break;
        case "backwards":
          for (n = null, l = t.child, t.child = null; l !== null; ) {
            if (((e = l.alternate), e !== null && hl(e) === null)) {
              t.child = l;
              break;
            }
            ((e = l.sibling), (l.sibling = n), (n = l), (l = e));
          }
          gi(t, !0, n, null, o);
          break;
        case "together":
          gi(t, !1, null, null, void 0);
          break;
        default:
          t.memoizedState = null;
      }
    return t.child;
  }
  function El(e, t) {
    (t.mode & 1) === 0 &&
      e !== null &&
      ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
  }
  function Lt(e, t, n) {
    if (
      (e !== null && (t.dependencies = e.dependencies),
      (fn |= t.lanes),
      (n & t.childLanes) === 0)
    )
      return null;
    if (e !== null && t.child !== e.child) throw Error(c(153));
    if (t.child !== null) {
      for (
        e = t.child, n = qt(e, e.pendingProps), t.child = n, n.return = t;
        e.sibling !== null;
      )
        ((e = e.sibling),
          (n = n.sibling = qt(e, e.pendingProps)),
          (n.return = t));
      n.sibling = null;
    }
    return t.child;
  }
  function Kf(e, t, n) {
    switch (t.tag) {
      case 3:
        (fa(t), Mn());
        break;
      case 5:
        Rs(t);
        break;
      case 1:
        Ye(t.type) && ol(t);
        break;
      case 4:
        Yo(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context,
          l = t.memoizedProps.value;
        (ue(fl, r._currentValue), (r._currentValue = l));
        break;
      case 13:
        if (((r = t.memoizedState), r !== null))
          return r.dehydrated !== null
            ? (ue(he, he.current & 1), (t.flags |= 128), null)
            : (n & t.child.childLanes) !== 0
              ? pa(e, t, n)
              : (ue(he, he.current & 1),
                (e = Lt(e, t, n)),
                e !== null ? e.sibling : null);
        ue(he, he.current & 1);
        break;
      case 19:
        if (((r = (n & t.childLanes) !== 0), (e.flags & 128) !== 0)) {
          if (r) return ha(e, t, n);
          t.flags |= 128;
        }
        if (
          ((l = t.memoizedState),
          l !== null &&
            ((l.rendering = null), (l.tail = null), (l.lastEffect = null)),
          ue(he, he.current),
          r)
        )
          break;
        return null;
      case 22:
      case 23:
        return ((t.lanes = 0), sa(e, t, n));
    }
    return Lt(e, t, n);
  }
  var ga, vi, va, ya;
  ((ga = function (e, t) {
    for (var n = t.child; n !== null; ) {
      if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
      else if (n.tag !== 4 && n.child !== null) {
        ((n.child.return = n), (n = n.child));
        continue;
      }
      if (n === t) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === t) return;
        n = n.return;
      }
      ((n.sibling.return = n.return), (n = n.sibling));
    }
  }),
    (vi = function () {}),
    (va = function (e, t, n, r) {
      var l = e.memoizedProps;
      if (l !== r) {
        ((e = t.stateNode), an(xt.current));
        var o = null;
        switch (n) {
          case "input":
            ((l = $l(e, l)), (r = $l(e, r)), (o = []));
            break;
          case "select":
            ((l = R({}, l, { value: void 0 })),
              (r = R({}, r, { value: void 0 })),
              (o = []));
            break;
          case "textarea":
            ((l = Xl(e, l)), (r = Xl(e, r)), (o = []));
            break;
          default:
            typeof l.onClick != "function" &&
              typeof r.onClick == "function" &&
              (e.onclick = nl);
        }
        Zl(n, r);
        var i;
        n = null;
        for (h in l)
          if (!r.hasOwnProperty(h) && l.hasOwnProperty(h) && l[h] != null)
            if (h === "style") {
              var u = l[h];
              for (i in u) u.hasOwnProperty(i) && (n || (n = {}), (n[i] = ""));
            } else
              h !== "dangerouslySetInnerHTML" &&
                h !== "children" &&
                h !== "suppressContentEditableWarning" &&
                h !== "suppressHydrationWarning" &&
                h !== "autoFocus" &&
                (C.hasOwnProperty(h)
                  ? o || (o = [])
                  : (o = o || []).push(h, null));
        for (h in r) {
          var a = r[h];
          if (
            ((u = l != null ? l[h] : void 0),
            r.hasOwnProperty(h) && a !== u && (a != null || u != null))
          )
            if (h === "style")
              if (u) {
                for (i in u)
                  !u.hasOwnProperty(i) ||
                    (a && a.hasOwnProperty(i)) ||
                    (n || (n = {}), (n[i] = ""));
                for (i in a)
                  a.hasOwnProperty(i) &&
                    u[i] !== a[i] &&
                    (n || (n = {}), (n[i] = a[i]));
              } else (n || (o || (o = []), o.push(h, n)), (n = a));
            else
              h === "dangerouslySetInnerHTML"
                ? ((a = a ? a.__html : void 0),
                  (u = u ? u.__html : void 0),
                  a != null && u !== a && (o = o || []).push(h, a))
                : h === "children"
                  ? (typeof a != "string" && typeof a != "number") ||
                    (o = o || []).push(h, "" + a)
                  : h !== "suppressContentEditableWarning" &&
                    h !== "suppressHydrationWarning" &&
                    (C.hasOwnProperty(h)
                      ? (a != null && h === "onScroll" && ae("scroll", e),
                        o || u === a || (o = []))
                      : (o = o || []).push(h, a));
        }
        n && (o = o || []).push("style", n);
        var h = o;
        (t.updateQueue = h) && (t.flags |= 4);
      }
    }),
    (ya = function (e, t, n, r) {
      n !== r && (t.flags |= 4);
    }));
  function Cr(e, t) {
    if (!de)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var n = null; t !== null; )
            (t.alternate !== null && (n = t), (t = t.sibling));
          n === null ? (e.tail = null) : (n.sibling = null);
          break;
        case "collapsed":
          n = e.tail;
          for (var r = null; n !== null; )
            (n.alternate !== null && (r = n), (n = n.sibling));
          r === null
            ? t || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (r.sibling = null);
      }
  }
  function Be(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      n = 0,
      r = 0;
    if (t)
      for (var l = e.child; l !== null; )
        ((n |= l.lanes | l.childLanes),
          (r |= l.subtreeFlags & 14680064),
          (r |= l.flags & 14680064),
          (l.return = e),
          (l = l.sibling));
    else
      for (l = e.child; l !== null; )
        ((n |= l.lanes | l.childLanes),
          (r |= l.subtreeFlags),
          (r |= l.flags),
          (l.return = e),
          (l = l.sibling));
    return ((e.subtreeFlags |= r), (e.childLanes = n), t);
  }
  function Xf(e, t, n) {
    var r = t.pendingProps;
    switch ((Uo(t), t.tag)) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (Be(t), null);
      case 1:
        return (Ye(t.type) && ll(), Be(t), null);
      case 3:
        return (
          (r = t.stateNode),
          Dn(),
          ce(Xe),
          ce(Ue),
          qo(),
          r.pendingContext &&
            ((r.context = r.pendingContext), (r.pendingContext = null)),
          (e === null || e.child === null) &&
            (al(t)
              ? (t.flags |= 4)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), pt !== null && (Pi(pt), (pt = null)))),
          vi(e, t),
          Be(t),
          null
        );
      case 5:
        Zo(t);
        var l = an(wr.current);
        if (((n = t.type), e !== null && t.stateNode != null))
          (va(e, t, n, r, l),
            e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(c(166));
            return (Be(t), null);
          }
          if (((e = an(xt.current)), al(t))) {
            ((r = t.stateNode), (n = t.type));
            var o = t.memoizedProps;
            switch (((r[kt] = t), (r[mr] = o), (e = (t.mode & 1) !== 0), n)) {
              case "dialog":
                (ae("cancel", r), ae("close", r));
                break;
              case "iframe":
              case "object":
              case "embed":
                ae("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < fr.length; l++) ae(fr[l], r);
                break;
              case "source":
                ae("error", r);
                break;
              case "img":
              case "image":
              case "link":
                (ae("error", r), ae("load", r));
                break;
              case "details":
                ae("toggle", r);
                break;
              case "input":
                (qi(r, o), ae("invalid", r));
                break;
              case "select":
                ((r._wrapperState = { wasMultiple: !!o.multiple }),
                  ae("invalid", r));
                break;
              case "textarea":
                (tu(r, o), ae("invalid", r));
            }
            (Zl(n, o), (l = null));
            for (var i in o)
              if (o.hasOwnProperty(i)) {
                var u = o[i];
                i === "children"
                  ? typeof u == "string"
                    ? r.textContent !== u &&
                      (o.suppressHydrationWarning !== !0 &&
                        tl(r.textContent, u, e),
                      (l = ["children", u]))
                    : typeof u == "number" &&
                      r.textContent !== "" + u &&
                      (o.suppressHydrationWarning !== !0 &&
                        tl(r.textContent, u, e),
                      (l = ["children", "" + u]))
                  : C.hasOwnProperty(i) &&
                    u != null &&
                    i === "onScroll" &&
                    ae("scroll", r);
              }
            switch (n) {
              case "input":
                (Ot(r), eu(r, o, !0));
                break;
              case "textarea":
                (Ot(r), ru(r));
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = nl);
            }
            ((r = l), (t.updateQueue = r), r !== null && (t.flags |= 4));
          } else {
            ((i = l.nodeType === 9 ? l : l.ownerDocument),
              e === "http://www.w3.org/1999/xhtml" && (e = lu(n)),
              e === "http://www.w3.org/1999/xhtml"
                ? n === "script"
                  ? ((e = i.createElement("div")),
                    (e.innerHTML = "<script><\/script>"),
                    (e = e.removeChild(e.firstChild)))
                  : typeof r.is == "string"
                    ? (e = i.createElement(n, { is: r.is }))
                    : ((e = i.createElement(n)),
                      n === "select" &&
                        ((i = e),
                        r.multiple
                          ? (i.multiple = !0)
                          : r.size && (i.size = r.size)))
                : (e = i.createElementNS(e, n)),
              (e[kt] = t),
              (e[mr] = r),
              ga(e, t, !1, !1),
              (t.stateNode = e));
            e: {
              switch (((i = Jl(n, r)), n)) {
                case "dialog":
                  (ae("cancel", e), ae("close", e), (l = r));
                  break;
                case "iframe":
                case "object":
                case "embed":
                  (ae("load", e), (l = r));
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < fr.length; l++) ae(fr[l], e);
                  l = r;
                  break;
                case "source":
                  (ae("error", e), (l = r));
                  break;
                case "img":
                case "image":
                case "link":
                  (ae("error", e), ae("load", e), (l = r));
                  break;
                case "details":
                  (ae("toggle", e), (l = r));
                  break;
                case "input":
                  (qi(e, r), (l = $l(e, r)), ae("invalid", e));
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  ((e._wrapperState = { wasMultiple: !!r.multiple }),
                    (l = R({}, r, { value: void 0 })),
                    ae("invalid", e));
                  break;
                case "textarea":
                  (tu(e, r), (l = Xl(e, r)), ae("invalid", e));
                  break;
                default:
                  l = r;
              }
              (Zl(n, l), (u = l));
              for (o in u)
                if (u.hasOwnProperty(o)) {
                  var a = u[o];
                  o === "style"
                    ? uu(e, a)
                    : o === "dangerouslySetInnerHTML"
                      ? ((a = a ? a.__html : void 0), a != null && ou(e, a))
                      : o === "children"
                        ? typeof a == "string"
                          ? (n !== "textarea" || a !== "") && Gn(e, a)
                          : typeof a == "number" && Gn(e, "" + a)
                        : o !== "suppressContentEditableWarning" &&
                          o !== "suppressHydrationWarning" &&
                          o !== "autoFocus" &&
                          (C.hasOwnProperty(o)
                            ? a != null && o === "onScroll" && ae("scroll", e)
                            : a != null && Oe(e, o, a, i));
                }
              switch (n) {
                case "input":
                  (Ot(e), eu(e, r, !1));
                  break;
                case "textarea":
                  (Ot(e), ru(e));
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + te(r.value));
                  break;
                case "select":
                  ((e.multiple = !!r.multiple),
                    (o = r.value),
                    o != null
                      ? vn(e, !!r.multiple, o, !1)
                      : r.defaultValue != null &&
                        vn(e, !!r.multiple, r.defaultValue, !0));
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = nl);
              }
              switch (n) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r = !!r.autoFocus;
                  break e;
                case "img":
                  r = !0;
                  break e;
                default:
                  r = !1;
              }
            }
            r && (t.flags |= 4);
          }
          t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
        }
        return (Be(t), null);
      case 6:
        if (e && t.stateNode != null) ya(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(c(166));
          if (((n = an(wr.current)), an(xt.current), al(t))) {
            if (
              ((r = t.stateNode),
              (n = t.memoizedProps),
              (r[kt] = t),
              (o = r.nodeValue !== n) && ((e = tt), e !== null))
            )
              switch (e.tag) {
                case 3:
                  tl(r.nodeValue, n, (e.mode & 1) !== 0);
                  break;
                case 5:
                  e.memoizedProps.suppressHydrationWarning !== !0 &&
                    tl(r.nodeValue, n, (e.mode & 1) !== 0);
              }
            o && (t.flags |= 4);
          } else
            ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
              (r[kt] = t),
              (t.stateNode = r));
        }
        return (Be(t), null);
      case 13:
        if (
          (ce(he),
          (r = t.memoizedState),
          e === null ||
            (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (de && nt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0)
            (xs(), Mn(), (t.flags |= 98560), (o = !1));
          else if (((o = al(t)), r !== null && r.dehydrated !== null)) {
            if (e === null) {
              if (!o) throw Error(c(318));
              if (
                ((o = t.memoizedState),
                (o = o !== null ? o.dehydrated : null),
                !o)
              )
                throw Error(c(317));
              o[kt] = t;
            } else
              (Mn(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4));
            (Be(t), (o = !1));
          } else (pt !== null && (Pi(pt), (pt = null)), (o = !0));
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0
          ? ((t.lanes = n), t)
          : ((r = r !== null),
            r !== (e !== null && e.memoizedState !== null) &&
              r &&
              ((t.child.flags |= 8192),
              (t.mode & 1) !== 0 &&
                (e === null || (he.current & 1) !== 0
                  ? Ce === 0 && (Ce = 3)
                  : Ti())),
            t.updateQueue !== null && (t.flags |= 4),
            Be(t),
            null);
      case 4:
        return (
          Dn(),
          vi(e, t),
          e === null && dr(t.stateNode.containerInfo),
          Be(t),
          null
        );
      case 10:
        return ($o(t.type._context), Be(t), null);
      case 17:
        return (Ye(t.type) && ll(), Be(t), null);
      case 19:
        if ((ce(he), (o = t.memoizedState), o === null)) return (Be(t), null);
        if (((r = (t.flags & 128) !== 0), (i = o.rendering), i === null))
          if (r) Cr(o, !1);
          else {
            if (Ce !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null; ) {
                if (((i = hl(e)), i !== null)) {
                  for (
                    t.flags |= 128,
                      Cr(o, !1),
                      r = i.updateQueue,
                      r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                      t.subtreeFlags = 0,
                      r = n,
                      n = t.child;
                    n !== null;
                  )
                    ((o = n),
                      (e = r),
                      (o.flags &= 14680066),
                      (i = o.alternate),
                      i === null
                        ? ((o.childLanes = 0),
                          (o.lanes = e),
                          (o.child = null),
                          (o.subtreeFlags = 0),
                          (o.memoizedProps = null),
                          (o.memoizedState = null),
                          (o.updateQueue = null),
                          (o.dependencies = null),
                          (o.stateNode = null))
                        : ((o.childLanes = i.childLanes),
                          (o.lanes = i.lanes),
                          (o.child = i.child),
                          (o.subtreeFlags = 0),
                          (o.deletions = null),
                          (o.memoizedProps = i.memoizedProps),
                          (o.memoizedState = i.memoizedState),
                          (o.updateQueue = i.updateQueue),
                          (o.type = i.type),
                          (e = i.dependencies),
                          (o.dependencies =
                            e === null
                              ? null
                              : {
                                  lanes: e.lanes,
                                  firstContext: e.firstContext,
                                })),
                      (n = n.sibling));
                  return (ue(he, (he.current & 1) | 2), t.child);
                }
                e = e.sibling;
              }
            o.tail !== null &&
              ye() > Vn &&
              ((t.flags |= 128), (r = !0), Cr(o, !1), (t.lanes = 4194304));
          }
        else {
          if (!r)
            if (((e = hl(i)), e !== null)) {
              if (
                ((t.flags |= 128),
                (r = !0),
                (n = e.updateQueue),
                n !== null && ((t.updateQueue = n), (t.flags |= 4)),
                Cr(o, !0),
                o.tail === null &&
                  o.tailMode === "hidden" &&
                  !i.alternate &&
                  !de)
              )
                return (Be(t), null);
            } else
              2 * ye() - o.renderingStartTime > Vn &&
                n !== 1073741824 &&
                ((t.flags |= 128), (r = !0), Cr(o, !1), (t.lanes = 4194304));
          o.isBackwards
            ? ((i.sibling = t.child), (t.child = i))
            : ((n = o.last),
              n !== null ? (n.sibling = i) : (t.child = i),
              (o.last = i));
        }
        return o.tail !== null
          ? ((t = o.tail),
            (o.rendering = t),
            (o.tail = t.sibling),
            (o.renderingStartTime = ye()),
            (t.sibling = null),
            (n = he.current),
            ue(he, r ? (n & 1) | 2 : n & 1),
            t)
          : (Be(t), null);
      case 22:
      case 23:
        return (
          Li(),
          (r = t.memoizedState !== null),
          e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
          r && (t.mode & 1) !== 0
            ? (rt & 1073741824) !== 0 &&
              (Be(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : Be(t),
          null
        );
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(c(156, t.tag));
  }
  function Yf(e, t) {
    switch ((Uo(t), t.tag)) {
      case 1:
        return (
          Ye(t.type) && ll(),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 3:
        return (
          Dn(),
          ce(Xe),
          ce(Ue),
          qo(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0
            ? ((t.flags = (e & -65537) | 128), t)
            : null
        );
      case 5:
        return (Zo(t), null);
      case 13:
        if (
          (ce(he), (e = t.memoizedState), e !== null && e.dehydrated !== null)
        ) {
          if (t.alternate === null) throw Error(c(340));
          Mn();
        }
        return (
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 19:
        return (ce(he), null);
      case 4:
        return (Dn(), null);
      case 10:
        return ($o(t.type._context), null);
      case 22:
      case 23:
        return (Li(), null);
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Cl = !1,
    We = !1,
    Zf = typeof WeakSet == "function" ? WeakSet : Set,
    L = null;
  function An(e, t) {
    var n = e.ref;
    if (n !== null)
      if (typeof n == "function")
        try {
          n(null);
        } catch (r) {
          ve(e, t, r);
        }
      else n.current = null;
  }
  function yi(e, t, n) {
    try {
      n();
    } catch (r) {
      ve(e, t, r);
    }
  }
  var wa = !1;
  function Jf(e, t) {
    if (((Lo = Qr), (e = Ju()), So(e))) {
      if ("selectionStart" in e)
        var n = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          n = ((n = e.ownerDocument) && n.defaultView) || window;
          var r = n.getSelection && n.getSelection();
          if (r && r.rangeCount !== 0) {
            n = r.anchorNode;
            var l = r.anchorOffset,
              o = r.focusNode;
            r = r.focusOffset;
            try {
              (n.nodeType, o.nodeType);
            } catch {
              n = null;
              break e;
            }
            var i = 0,
              u = -1,
              a = -1,
              h = 0,
              k = 0,
              S = e,
              w = null;
            t: for (;;) {
              for (
                var z;
                S !== n || (l !== 0 && S.nodeType !== 3) || (u = i + l),
                  S !== o || (r !== 0 && S.nodeType !== 3) || (a = i + r),
                  S.nodeType === 3 && (i += S.nodeValue.length),
                  (z = S.firstChild) !== null;
              )
                ((w = S), (S = z));
              for (;;) {
                if (S === e) break t;
                if (
                  (w === n && ++h === l && (u = i),
                  w === o && ++k === r && (a = i),
                  (z = S.nextSibling) !== null)
                )
                  break;
                ((S = w), (w = S.parentNode));
              }
              S = z;
            }
            n = u === -1 || a === -1 ? null : { start: u, end: a };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (
      To = { focusedElem: e, selectionRange: n }, Qr = !1, L = t;
      L !== null;
    )
      if (((t = L), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
        ((e.return = t), (L = e));
      else
        for (; L !== null; ) {
          t = L;
          try {
            var T = t.alternate;
            if ((t.flags & 1024) !== 0)
              switch (t.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (T !== null) {
                    var O = T.memoizedProps,
                      we = T.memoizedState,
                      p = t.stateNode,
                      f = p.getSnapshotBeforeUpdate(
                        t.elementType === t.type ? O : mt(t.type, O),
                        we,
                      );
                    p.__reactInternalSnapshotBeforeUpdate = f;
                  }
                  break;
                case 3:
                  var m = t.stateNode.containerInfo;
                  m.nodeType === 1
                    ? (m.textContent = "")
                    : m.nodeType === 9 &&
                      m.documentElement &&
                      m.removeChild(m.documentElement);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(c(163));
              }
          } catch (E) {
            ve(t, t.return, E);
          }
          if (((e = t.sibling), e !== null)) {
            ((e.return = t.return), (L = e));
            break;
          }
          L = t.return;
        }
    return ((T = wa), (wa = !1), T);
  }
  function _r(e, t, n) {
    var r = t.updateQueue;
    if (((r = r !== null ? r.lastEffect : null), r !== null)) {
      var l = (r = r.next);
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          ((l.destroy = void 0), o !== void 0 && yi(t, n, o));
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function _l(e, t) {
    if (
      ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
    ) {
      var n = (t = t.next);
      do {
        if ((n.tag & e) === e) {
          var r = n.create;
          n.destroy = r();
        }
        n = n.next;
      } while (n !== t);
    }
  }
  function wi(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      switch (e.tag) {
        case 5:
          e = n;
          break;
        default:
          e = n;
      }
      typeof t == "function" ? t(e) : (t.current = e);
    }
  }
  function ka(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), ka(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 &&
        ((t = e.stateNode),
        t !== null &&
          (delete t[kt],
          delete t[mr],
          delete t[jo],
          delete t[If],
          delete t[Of])),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  function xa(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Sa(e) {
    e: for (;;) {
      for (; e.sibling === null; ) {
        if (e.return === null || xa(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function ki(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6)
      ((e = e.stateNode),
        t
          ? n.nodeType === 8
            ? n.parentNode.insertBefore(e, t)
            : n.insertBefore(e, t)
          : (n.nodeType === 8
              ? ((t = n.parentNode), t.insertBefore(e, n))
              : ((t = n), t.appendChild(e)),
            (n = n._reactRootContainer),
            n != null || t.onclick !== null || (t.onclick = nl)));
    else if (r !== 4 && ((e = e.child), e !== null))
      for (ki(e, t, n), e = e.sibling; e !== null; )
        (ki(e, t, n), (e = e.sibling));
  }
  function xi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6)
      ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
    else if (r !== 4 && ((e = e.child), e !== null))
      for (xi(e, t, n), e = e.sibling; e !== null; )
        (xi(e, t, n), (e = e.sibling));
  }
  var De = null,
    ht = !1;
  function Kt(e, t, n) {
    for (n = n.child; n !== null; ) (Ea(e, t, n), (n = n.sibling));
  }
  function Ea(e, t, n) {
    if (wt && typeof wt.onCommitFiberUnmount == "function")
      try {
        wt.onCommitFiberUnmount(Ar, n);
      } catch {}
    switch (n.tag) {
      case 5:
        We || An(n, t);
      case 6:
        var r = De,
          l = ht;
        ((De = null),
          Kt(e, t, n),
          (De = r),
          (ht = l),
          De !== null &&
            (ht
              ? ((e = De),
                (n = n.stateNode),
                e.nodeType === 8
                  ? e.parentNode.removeChild(n)
                  : e.removeChild(n))
              : De.removeChild(n.stateNode)));
        break;
      case 18:
        De !== null &&
          (ht
            ? ((e = De),
              (n = n.stateNode),
              e.nodeType === 8
                ? Oo(e.parentNode, n)
                : e.nodeType === 1 && Oo(e, n),
              rr(e))
            : Oo(De, n.stateNode));
        break;
      case 4:
        ((r = De),
          (l = ht),
          (De = n.stateNode.containerInfo),
          (ht = !0),
          Kt(e, t, n),
          (De = r),
          (ht = l));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (
          !We &&
          ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
        ) {
          l = r = r.next;
          do {
            var o = l,
              i = o.destroy;
            ((o = o.tag),
              i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && yi(n, t, i),
              (l = l.next));
          } while (l !== r);
        }
        Kt(e, t, n);
        break;
      case 1:
        if (
          !We &&
          (An(n, t),
          (r = n.stateNode),
          typeof r.componentWillUnmount == "function")
        )
          try {
            ((r.props = n.memoizedProps),
              (r.state = n.memoizedState),
              r.componentWillUnmount());
          } catch (u) {
            ve(n, t, u);
          }
        Kt(e, t, n);
        break;
      case 21:
        Kt(e, t, n);
        break;
      case 22:
        n.mode & 1
          ? ((We = (r = We) || n.memoizedState !== null), Kt(e, t, n), (We = r))
          : Kt(e, t, n);
        break;
      default:
        Kt(e, t, n);
    }
  }
  function Ca(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      (n === null && (n = e.stateNode = new Zf()),
        t.forEach(function (r) {
          var l = id.bind(null, e, r);
          n.has(r) || (n.add(r), r.then(l, l));
        }));
    }
  }
  function gt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var r = 0; r < n.length; r++) {
        var l = n[r];
        try {
          var o = e,
            i = t,
            u = i;
          e: for (; u !== null; ) {
            switch (u.tag) {
              case 5:
                ((De = u.stateNode), (ht = !1));
                break e;
              case 3:
                ((De = u.stateNode.containerInfo), (ht = !0));
                break e;
              case 4:
                ((De = u.stateNode.containerInfo), (ht = !0));
                break e;
            }
            u = u.return;
          }
          if (De === null) throw Error(c(160));
          (Ea(o, i, l), (De = null), (ht = !1));
          var a = l.alternate;
          (a !== null && (a.return = null), (l.return = null));
        } catch (h) {
          ve(l, t, h);
        }
      }
    if (t.subtreeFlags & 12854)
      for (t = t.child; t !== null; ) (_a(t, e), (t = t.sibling));
  }
  function _a(e, t) {
    var n = e.alternate,
      r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if ((gt(t, e), Et(e), r & 4)) {
          try {
            (_r(3, e, e.return), _l(3, e));
          } catch (O) {
            ve(e, e.return, O);
          }
          try {
            _r(5, e, e.return);
          } catch (O) {
            ve(e, e.return, O);
          }
        }
        break;
      case 1:
        (gt(t, e), Et(e), r & 512 && n !== null && An(n, n.return));
        break;
      case 5:
        if (
          (gt(t, e),
          Et(e),
          r & 512 && n !== null && An(n, n.return),
          e.flags & 32)
        ) {
          var l = e.stateNode;
          try {
            Gn(l, "");
          } catch (O) {
            ve(e, e.return, O);
          }
        }
        if (r & 4 && ((l = e.stateNode), l != null)) {
          var o = e.memoizedProps,
            i = n !== null ? n.memoizedProps : o,
            u = e.type,
            a = e.updateQueue;
          if (((e.updateQueue = null), a !== null))
            try {
              (u === "input" &&
                o.type === "radio" &&
                o.name != null &&
                bi(l, o),
                Jl(u, i));
              var h = Jl(u, o);
              for (i = 0; i < a.length; i += 2) {
                var k = a[i],
                  S = a[i + 1];
                k === "style"
                  ? uu(l, S)
                  : k === "dangerouslySetInnerHTML"
                    ? ou(l, S)
                    : k === "children"
                      ? Gn(l, S)
                      : Oe(l, k, S, h);
              }
              switch (u) {
                case "input":
                  Gl(l, o);
                  break;
                case "textarea":
                  nu(l, o);
                  break;
                case "select":
                  var w = l._wrapperState.wasMultiple;
                  l._wrapperState.wasMultiple = !!o.multiple;
                  var z = o.value;
                  z != null
                    ? vn(l, !!o.multiple, z, !1)
                    : w !== !!o.multiple &&
                      (o.defaultValue != null
                        ? vn(l, !!o.multiple, o.defaultValue, !0)
                        : vn(l, !!o.multiple, o.multiple ? [] : "", !1));
              }
              l[mr] = o;
            } catch (O) {
              ve(e, e.return, O);
            }
        }
        break;
      case 6:
        if ((gt(t, e), Et(e), r & 4)) {
          if (e.stateNode === null) throw Error(c(162));
          ((l = e.stateNode), (o = e.memoizedProps));
          try {
            l.nodeValue = o;
          } catch (O) {
            ve(e, e.return, O);
          }
        }
        break;
      case 3:
        if (
          (gt(t, e), Et(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
        )
          try {
            rr(t.containerInfo);
          } catch (O) {
            ve(e, e.return, O);
          }
        break;
      case 4:
        (gt(t, e), Et(e));
        break;
      case 13:
        (gt(t, e),
          Et(e),
          (l = e.child),
          l.flags & 8192 &&
            ((o = l.memoizedState !== null),
            (l.stateNode.isHidden = o),
            !o ||
              (l.alternate !== null && l.alternate.memoizedState !== null) ||
              (Ci = ye())),
          r & 4 && Ca(e));
        break;
      case 22:
        if (
          ((k = n !== null && n.memoizedState !== null),
          e.mode & 1 ? ((We = (h = We) || k), gt(t, e), (We = h)) : gt(t, e),
          Et(e),
          r & 8192)
        ) {
          if (
            ((h = e.memoizedState !== null),
            (e.stateNode.isHidden = h) && !k && (e.mode & 1) !== 0)
          )
            for (L = e, k = e.child; k !== null; ) {
              for (S = L = k; L !== null; ) {
                switch (((w = L), (z = w.child), w.tag)) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    _r(4, w, w.return);
                    break;
                  case 1:
                    An(w, w.return);
                    var T = w.stateNode;
                    if (typeof T.componentWillUnmount == "function") {
                      ((r = w), (n = w.return));
                      try {
                        ((t = r),
                          (T.props = t.memoizedProps),
                          (T.state = t.memoizedState),
                          T.componentWillUnmount());
                      } catch (O) {
                        ve(r, n, O);
                      }
                    }
                    break;
                  case 5:
                    An(w, w.return);
                    break;
                  case 22:
                    if (w.memoizedState !== null) {
                      Pa(S);
                      continue;
                    }
                }
                z !== null ? ((z.return = w), (L = z)) : Pa(S);
              }
              k = k.sibling;
            }
          e: for (k = null, S = e; ; ) {
            if (S.tag === 5) {
              if (k === null) {
                k = S;
                try {
                  ((l = S.stateNode),
                    h
                      ? ((o = l.style),
                        typeof o.setProperty == "function"
                          ? o.setProperty("display", "none", "important")
                          : (o.display = "none"))
                      : ((u = S.stateNode),
                        (a = S.memoizedProps.style),
                        (i =
                          a != null && a.hasOwnProperty("display")
                            ? a.display
                            : null),
                        (u.style.display = iu("display", i))));
                } catch (O) {
                  ve(e, e.return, O);
                }
              }
            } else if (S.tag === 6) {
              if (k === null)
                try {
                  S.stateNode.nodeValue = h ? "" : S.memoizedProps;
                } catch (O) {
                  ve(e, e.return, O);
                }
            } else if (
              ((S.tag !== 22 && S.tag !== 23) ||
                S.memoizedState === null ||
                S === e) &&
              S.child !== null
            ) {
              ((S.child.return = S), (S = S.child));
              continue;
            }
            if (S === e) break e;
            for (; S.sibling === null; ) {
              if (S.return === null || S.return === e) break e;
              (k === S && (k = null), (S = S.return));
            }
            (k === S && (k = null),
              (S.sibling.return = S.return),
              (S = S.sibling));
          }
        }
        break;
      case 19:
        (gt(t, e), Et(e), r & 4 && Ca(e));
        break;
      case 21:
        break;
      default:
        (gt(t, e), Et(e));
    }
  }
  function Et(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (xa(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(c(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (Gn(l, ""), (r.flags &= -33));
            var o = Sa(e);
            xi(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo,
              u = Sa(e);
            ki(e, u, i);
            break;
          default:
            throw Error(c(161));
        }
      } catch (a) {
        ve(e, e.return, a);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function qf(e, t, n) {
    ((L = e), za(e));
  }
  function za(e, t, n) {
    for (var r = (e.mode & 1) !== 0; L !== null; ) {
      var l = L,
        o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || Cl;
        if (!i) {
          var u = l.alternate,
            a = (u !== null && u.memoizedState !== null) || We;
          u = Cl;
          var h = We;
          if (((Cl = i), (We = a) && !h))
            for (L = l; L !== null; )
              ((i = L),
                (a = i.child),
                i.tag === 22 && i.memoizedState !== null
                  ? Ra(l)
                  : a !== null
                    ? ((a.return = i), (L = a))
                    : Ra(l));
          for (; o !== null; ) ((L = o), za(o), (o = o.sibling));
          ((L = l), (Cl = u), (We = h));
        }
        Na(e);
      } else
        (l.subtreeFlags & 8772) !== 0 && o !== null
          ? ((o.return = l), (L = o))
          : Na(e);
    }
  }
  function Na(e) {
    for (; L !== null; ) {
      var t = L;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                We || _l(5, t);
                break;
              case 1:
                var r = t.stateNode;
                if (t.flags & 4 && !We)
                  if (n === null) r.componentDidMount();
                  else {
                    var l =
                      t.elementType === t.type
                        ? n.memoizedProps
                        : mt(t.type, n.memoizedProps);
                    r.componentDidUpdate(
                      l,
                      n.memoizedState,
                      r.__reactInternalSnapshotBeforeUpdate,
                    );
                  }
                var o = t.updateQueue;
                o !== null && Ps(t, o, r);
                break;
              case 3:
                var i = t.updateQueue;
                if (i !== null) {
                  if (((n = null), t.child !== null))
                    switch (t.child.tag) {
                      case 5:
                        n = t.child.stateNode;
                        break;
                      case 1:
                        n = t.child.stateNode;
                    }
                  Ps(t, i, n);
                }
                break;
              case 5:
                var u = t.stateNode;
                if (n === null && t.flags & 4) {
                  n = u;
                  var a = t.memoizedProps;
                  switch (t.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      a.autoFocus && n.focus();
                      break;
                    case "img":
                      a.src && (n.src = a.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (t.memoizedState === null) {
                  var h = t.alternate;
                  if (h !== null) {
                    var k = h.memoizedState;
                    if (k !== null) {
                      var S = k.dehydrated;
                      S !== null && rr(S);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(c(163));
            }
          We || (t.flags & 512 && wi(t));
        } catch (w) {
          ve(t, t.return, w);
        }
      }
      if (t === e) {
        L = null;
        break;
      }
      if (((n = t.sibling), n !== null)) {
        ((n.return = t.return), (L = n));
        break;
      }
      L = t.return;
    }
  }
  function Pa(e) {
    for (; L !== null; ) {
      var t = L;
      if (t === e) {
        L = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        ((n.return = t.return), (L = n));
        break;
      }
      L = t.return;
    }
  }
  function Ra(e) {
    for (; L !== null; ) {
      var t = L;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              _l(4, t);
            } catch (a) {
              ve(t, n, a);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (a) {
                ve(t, l, a);
              }
            }
            var o = t.return;
            try {
              wi(t);
            } catch (a) {
              ve(t, o, a);
            }
            break;
          case 5:
            var i = t.return;
            try {
              wi(t);
            } catch (a) {
              ve(t, i, a);
            }
        }
      } catch (a) {
        ve(t, t.return, a);
      }
      if (t === e) {
        L = null;
        break;
      }
      var u = t.sibling;
      if (u !== null) {
        ((u.return = t.return), (L = u));
        break;
      }
      L = t.return;
    }
  }
  var bf = Math.ceil,
    zl = pe.ReactCurrentDispatcher,
    Si = pe.ReactCurrentOwner,
    at = pe.ReactCurrentBatchConfig,
    b = 0,
    Te = null,
    xe = null,
    Fe = 0,
    rt = 0,
    Un = Wt(0),
    Ce = 0,
    zr = null,
    fn = 0,
    Nl = 0,
    Ei = 0,
    Nr = null,
    Je = null,
    Ci = 0,
    Vn = 1 / 0,
    Tt = null,
    Pl = !1,
    _i = null,
    Xt = null,
    Rl = !1,
    Yt = null,
    Ll = 0,
    Pr = 0,
    zi = null,
    Tl = -1,
    Ml = 0;
  function Ke() {
    return (b & 6) !== 0 ? ye() : Tl !== -1 ? Tl : (Tl = ye());
  }
  function Zt(e) {
    return (e.mode & 1) === 0
      ? 1
      : (b & 2) !== 0 && Fe !== 0
        ? Fe & -Fe
        : Df.transition !== null
          ? (Ml === 0 && (Ml = Su()), Ml)
          : ((e = ie),
            e !== 0 ||
              ((e = window.event), (e = e === void 0 ? 16 : Tu(e.type))),
            e);
  }
  function vt(e, t, n, r) {
    if (50 < Pr) throw ((Pr = 0), (zi = null), Error(c(185)));
    (qn(e, n, r),
      ((b & 2) === 0 || e !== Te) &&
        (e === Te && ((b & 2) === 0 && (Nl |= n), Ce === 4 && Jt(e, Fe)),
        qe(e, r),
        n === 1 &&
          b === 0 &&
          (t.mode & 1) === 0 &&
          ((Vn = ye() + 500), il && Qt())));
  }
  function qe(e, t) {
    var n = e.callbackNode;
    jc(e, t);
    var r = Br(e, e === Te ? Fe : 0);
    if (r === 0)
      (n !== null && wu(n), (e.callbackNode = null), (e.callbackPriority = 0));
    else if (((t = r & -r), e.callbackPriority !== t)) {
      if ((n != null && wu(n), t === 1))
        (e.tag === 0 ? jf(Ta.bind(null, e)) : gs(Ta.bind(null, e)),
          Tf(function () {
            (b & 6) === 0 && Qt();
          }),
          (n = null));
      else {
        switch (Eu(r)) {
          case 1:
            n = lo;
            break;
          case 4:
            n = ku;
            break;
          case 16:
            n = Fr;
            break;
          case 536870912:
            n = xu;
            break;
          default:
            n = Fr;
        }
        n = Ua(n, La.bind(null, e));
      }
      ((e.callbackPriority = t), (e.callbackNode = n));
    }
  }
  function La(e, t) {
    if (((Tl = -1), (Ml = 0), (b & 6) !== 0)) throw Error(c(327));
    var n = e.callbackNode;
    if (Bn() && e.callbackNode !== n) return null;
    var r = Br(e, e === Te ? Fe : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Il(e, r);
    else {
      t = r;
      var l = b;
      b |= 2;
      var o = Ia();
      (Te !== e || Fe !== t) && ((Tt = null), (Vn = ye() + 500), pn(e, t));
      do
        try {
          nd();
          break;
        } catch (u) {
          Ma(e, u);
        }
      while (!0);
      (Qo(),
        (zl.current = o),
        (b = l),
        xe !== null ? (t = 0) : ((Te = null), (Fe = 0), (t = Ce)));
    }
    if (t !== 0) {
      if (
        (t === 2 && ((l = oo(e)), l !== 0 && ((r = l), (t = Ni(e, l)))),
        t === 1)
      )
        throw ((n = zr), pn(e, 0), Jt(e, r), qe(e, ye()), n);
      if (t === 6) Jt(e, r);
      else {
        if (
          ((l = e.current.alternate),
          (r & 30) === 0 &&
            !ed(l) &&
            ((t = Il(e, r)),
            t === 2 && ((o = oo(e)), o !== 0 && ((r = o), (t = Ni(e, o)))),
            t === 1))
        )
          throw ((n = zr), pn(e, 0), Jt(e, r), qe(e, ye()), n);
        switch (((e.finishedWork = l), (e.finishedLanes = r), t)) {
          case 0:
          case 1:
            throw Error(c(345));
          case 2:
            mn(e, Je, Tt);
            break;
          case 3:
            if (
              (Jt(e, r),
              (r & 130023424) === r && ((t = Ci + 500 - ye()), 10 < t))
            ) {
              if (Br(e, 0) !== 0) break;
              if (((l = e.suspendedLanes), (l & r) !== r)) {
                (Ke(), (e.pingedLanes |= e.suspendedLanes & l));
                break;
              }
              e.timeoutHandle = Io(mn.bind(null, e, Je, Tt), t);
              break;
            }
            mn(e, Je, Tt);
            break;
          case 4:
            if ((Jt(e, r), (r & 4194240) === r)) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var i = 31 - ft(r);
              ((o = 1 << i), (i = t[i]), i > l && (l = i), (r &= ~o));
            }
            if (
              ((r = l),
              (r = ye() - r),
              (r =
                (120 > r
                  ? 120
                  : 480 > r
                    ? 480
                    : 1080 > r
                      ? 1080
                      : 1920 > r
                        ? 1920
                        : 3e3 > r
                          ? 3e3
                          : 4320 > r
                            ? 4320
                            : 1960 * bf(r / 1960)) - r),
              10 < r)
            ) {
              e.timeoutHandle = Io(mn.bind(null, e, Je, Tt), r);
              break;
            }
            mn(e, Je, Tt);
            break;
          case 5:
            mn(e, Je, Tt);
            break;
          default:
            throw Error(c(329));
        }
      }
    }
    return (qe(e, ye()), e.callbackNode === n ? La.bind(null, e) : null);
  }
  function Ni(e, t) {
    var n = Nr;
    return (
      e.current.memoizedState.isDehydrated && (pn(e, t).flags |= 256),
      (e = Il(e, t)),
      e !== 2 && ((t = Je), (Je = n), t !== null && Pi(t)),
      e
    );
  }
  function Pi(e) {
    Je === null ? (Je = e) : Je.push.apply(Je, e);
  }
  function ed(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && ((n = n.stores), n !== null))
          for (var r = 0; r < n.length; r++) {
            var l = n[r],
              o = l.getSnapshot;
            l = l.value;
            try {
              if (!dt(o(), l)) return !1;
            } catch {
              return !1;
            }
          }
      }
      if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
        ((n.return = t), (t = n));
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function Jt(e, t) {
    for (
      t &= ~Ei,
        t &= ~Nl,
        e.suspendedLanes |= t,
        e.pingedLanes &= ~t,
        e = e.expirationTimes;
      0 < t;
    ) {
      var n = 31 - ft(t),
        r = 1 << n;
      ((e[n] = -1), (t &= ~r));
    }
  }
  function Ta(e) {
    if ((b & 6) !== 0) throw Error(c(327));
    Bn();
    var t = Br(e, 0);
    if ((t & 1) === 0) return (qe(e, ye()), null);
    var n = Il(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = oo(e);
      r !== 0 && ((t = r), (n = Ni(e, r)));
    }
    if (n === 1) throw ((n = zr), pn(e, 0), Jt(e, t), qe(e, ye()), n);
    if (n === 6) throw Error(c(345));
    return (
      (e.finishedWork = e.current.alternate),
      (e.finishedLanes = t),
      mn(e, Je, Tt),
      qe(e, ye()),
      null
    );
  }
  function Ri(e, t) {
    var n = b;
    b |= 1;
    try {
      return e(t);
    } finally {
      ((b = n), b === 0 && ((Vn = ye() + 500), il && Qt()));
    }
  }
  function dn(e) {
    Yt !== null && Yt.tag === 0 && (b & 6) === 0 && Bn();
    var t = b;
    b |= 1;
    var n = at.transition,
      r = ie;
    try {
      if (((at.transition = null), (ie = 1), e)) return e();
    } finally {
      ((ie = r), (at.transition = n), (b = t), (b & 6) === 0 && Qt());
    }
  }
  function Li() {
    ((rt = Un.current), ce(Un));
  }
  function pn(e, t) {
    ((e.finishedWork = null), (e.finishedLanes = 0));
    var n = e.timeoutHandle;
    if ((n !== -1 && ((e.timeoutHandle = -1), Lf(n)), xe !== null))
      for (n = xe.return; n !== null; ) {
        var r = n;
        switch ((Uo(r), r.tag)) {
          case 1:
            ((r = r.type.childContextTypes), r != null && ll());
            break;
          case 3:
            (Dn(), ce(Xe), ce(Ue), qo());
            break;
          case 5:
            Zo(r);
            break;
          case 4:
            Dn();
            break;
          case 13:
            ce(he);
            break;
          case 19:
            ce(he);
            break;
          case 10:
            $o(r.type._context);
            break;
          case 22:
          case 23:
            Li();
        }
        n = n.return;
      }
    if (
      ((Te = e),
      (xe = e = qt(e.current, null)),
      (Fe = rt = t),
      (Ce = 0),
      (zr = null),
      (Ei = Nl = fn = 0),
      (Je = Nr = null),
      sn !== null)
    ) {
      for (t = 0; t < sn.length; t++)
        if (((n = sn[t]), (r = n.interleaved), r !== null)) {
          n.interleaved = null;
          var l = r.next,
            o = n.pending;
          if (o !== null) {
            var i = o.next;
            ((o.next = l), (r.next = i));
          }
          n.pending = r;
        }
      sn = null;
    }
    return e;
  }
  function Ma(e, t) {
    do {
      var n = xe;
      try {
        if ((Qo(), (gl.current = kl), vl)) {
          for (var r = ge.memoizedState; r !== null; ) {
            var l = r.queue;
            (l !== null && (l.pending = null), (r = r.next));
          }
          vl = !1;
        }
        if (
          ((cn = 0),
          (Le = Ee = ge = null),
          (kr = !1),
          (xr = 0),
          (Si.current = null),
          n === null || n.return === null)
        ) {
          ((Ce = 1), (zr = t), (xe = null));
          break;
        }
        e: {
          var o = e,
            i = n.return,
            u = n,
            a = t;
          if (
            ((t = Fe),
            (u.flags |= 32768),
            a !== null && typeof a == "object" && typeof a.then == "function")
          ) {
            var h = a,
              k = u,
              S = k.tag;
            if ((k.mode & 1) === 0 && (S === 0 || S === 11 || S === 15)) {
              var w = k.alternate;
              w
                ? ((k.updateQueue = w.updateQueue),
                  (k.memoizedState = w.memoizedState),
                  (k.lanes = w.lanes))
                : ((k.updateQueue = null), (k.memoizedState = null));
            }
            var z = ra(i);
            if (z !== null) {
              ((z.flags &= -257),
                la(z, i, u, o, t),
                z.mode & 1 && na(o, h, t),
                (t = z),
                (a = h));
              var T = t.updateQueue;
              if (T === null) {
                var O = new Set();
                (O.add(a), (t.updateQueue = O));
              } else T.add(a);
              break e;
            } else {
              if ((t & 1) === 0) {
                (na(o, h, t), Ti());
                break e;
              }
              a = Error(c(426));
            }
          } else if (de && u.mode & 1) {
            var we = ra(i);
            if (we !== null) {
              ((we.flags & 65536) === 0 && (we.flags |= 256),
                la(we, i, u, o, t),
                Wo(Fn(a, u)));
              break e;
            }
          }
          ((o = a = Fn(a, u)),
            Ce !== 4 && (Ce = 2),
            Nr === null ? (Nr = [o]) : Nr.push(o),
            (o = i));
          do {
            switch (o.tag) {
              case 3:
                ((o.flags |= 65536), (t &= -t), (o.lanes |= t));
                var p = ea(o, a, t);
                Ns(o, p);
                break e;
              case 1:
                u = a;
                var f = o.type,
                  m = o.stateNode;
                if (
                  (o.flags & 128) === 0 &&
                  (typeof f.getDerivedStateFromError == "function" ||
                    (m !== null &&
                      typeof m.componentDidCatch == "function" &&
                      (Xt === null || !Xt.has(m))))
                ) {
                  ((o.flags |= 65536), (t &= -t), (o.lanes |= t));
                  var E = ta(o, u, t);
                  Ns(o, E);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        ja(n);
      } catch (j) {
        ((t = j), xe === n && n !== null && (xe = n = n.return));
        continue;
      }
      break;
    } while (!0);
  }
  function Ia() {
    var e = zl.current;
    return ((zl.current = kl), e === null ? kl : e);
  }
  function Ti() {
    ((Ce === 0 || Ce === 3 || Ce === 2) && (Ce = 4),
      Te === null ||
        ((fn & 268435455) === 0 && (Nl & 268435455) === 0) ||
        Jt(Te, Fe));
  }
  function Il(e, t) {
    var n = b;
    b |= 2;
    var r = Ia();
    (Te !== e || Fe !== t) && ((Tt = null), pn(e, t));
    do
      try {
        td();
        break;
      } catch (l) {
        Ma(e, l);
      }
    while (!0);
    if ((Qo(), (b = n), (zl.current = r), xe !== null)) throw Error(c(261));
    return ((Te = null), (Fe = 0), Ce);
  }
  function td() {
    for (; xe !== null; ) Oa(xe);
  }
  function nd() {
    for (; xe !== null && !zc(); ) Oa(xe);
  }
  function Oa(e) {
    var t = Aa(e.alternate, e, rt);
    ((e.memoizedProps = e.pendingProps),
      t === null ? ja(e) : (xe = t),
      (Si.current = null));
  }
  function ja(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (((e = t.return), (t.flags & 32768) === 0)) {
        if (((n = Xf(n, t, rt)), n !== null)) {
          xe = n;
          return;
        }
      } else {
        if (((n = Yf(n, t)), n !== null)) {
          ((n.flags &= 32767), (xe = n));
          return;
        }
        if (e !== null)
          ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
        else {
          ((Ce = 6), (xe = null));
          return;
        }
      }
      if (((t = t.sibling), t !== null)) {
        xe = t;
        return;
      }
      xe = t = e;
    } while (t !== null);
    Ce === 0 && (Ce = 5);
  }
  function mn(e, t, n) {
    var r = ie,
      l = at.transition;
    try {
      ((at.transition = null), (ie = 1), rd(e, t, n, r));
    } finally {
      ((at.transition = l), (ie = r));
    }
    return null;
  }
  function rd(e, t, n, r) {
    do Bn();
    while (Yt !== null);
    if ((b & 6) !== 0) throw Error(c(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
      throw Error(c(177));
    ((e.callbackNode = null), (e.callbackPriority = 0));
    var o = n.lanes | n.childLanes;
    if (
      (Dc(e, o),
      e === Te && ((xe = Te = null), (Fe = 0)),
      ((n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0) ||
        Rl ||
        ((Rl = !0),
        Ua(Fr, function () {
          return (Bn(), null);
        })),
      (o = (n.flags & 15990) !== 0),
      (n.subtreeFlags & 15990) !== 0 || o)
    ) {
      ((o = at.transition), (at.transition = null));
      var i = ie;
      ie = 1;
      var u = b;
      ((b |= 4),
        (Si.current = null),
        Jf(e, n),
        _a(n, e),
        Ef(To),
        (Qr = !!Lo),
        (To = Lo = null),
        (e.current = n),
        qf(n),
        Nc(),
        (b = u),
        (ie = i),
        (at.transition = o));
    } else e.current = n;
    if (
      (Rl && ((Rl = !1), (Yt = e), (Ll = l)),
      (o = e.pendingLanes),
      o === 0 && (Xt = null),
      Lc(n.stateNode),
      qe(e, ye()),
      t !== null)
    )
      for (r = e.onRecoverableError, n = 0; n < t.length; n++)
        ((l = t[n]), r(l.value, { componentStack: l.stack, digest: l.digest }));
    if (Pl) throw ((Pl = !1), (e = _i), (_i = null), e);
    return (
      (Ll & 1) !== 0 && e.tag !== 0 && Bn(),
      (o = e.pendingLanes),
      (o & 1) !== 0 ? (e === zi ? Pr++ : ((Pr = 0), (zi = e))) : (Pr = 0),
      Qt(),
      null
    );
  }
  function Bn() {
    if (Yt !== null) {
      var e = Eu(Ll),
        t = at.transition,
        n = ie;
      try {
        if (((at.transition = null), (ie = 16 > e ? 16 : e), Yt === null))
          var r = !1;
        else {
          if (((e = Yt), (Yt = null), (Ll = 0), (b & 6) !== 0))
            throw Error(c(331));
          var l = b;
          for (b |= 4, L = e.current; L !== null; ) {
            var o = L,
              i = o.child;
            if ((L.flags & 16) !== 0) {
              var u = o.deletions;
              if (u !== null) {
                for (var a = 0; a < u.length; a++) {
                  var h = u[a];
                  for (L = h; L !== null; ) {
                    var k = L;
                    switch (k.tag) {
                      case 0:
                      case 11:
                      case 15:
                        _r(8, k, o);
                    }
                    var S = k.child;
                    if (S !== null) ((S.return = k), (L = S));
                    else
                      for (; L !== null; ) {
                        k = L;
                        var w = k.sibling,
                          z = k.return;
                        if ((ka(k), k === h)) {
                          L = null;
                          break;
                        }
                        if (w !== null) {
                          ((w.return = z), (L = w));
                          break;
                        }
                        L = z;
                      }
                  }
                }
                var T = o.alternate;
                if (T !== null) {
                  var O = T.child;
                  if (O !== null) {
                    T.child = null;
                    do {
                      var we = O.sibling;
                      ((O.sibling = null), (O = we));
                    } while (O !== null);
                  }
                }
                L = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && i !== null)
              ((i.return = o), (L = i));
            else
              e: for (; L !== null; ) {
                if (((o = L), (o.flags & 2048) !== 0))
                  switch (o.tag) {
                    case 0:
                    case 11:
                    case 15:
                      _r(9, o, o.return);
                  }
                var p = o.sibling;
                if (p !== null) {
                  ((p.return = o.return), (L = p));
                  break e;
                }
                L = o.return;
              }
          }
          var f = e.current;
          for (L = f; L !== null; ) {
            i = L;
            var m = i.child;
            if ((i.subtreeFlags & 2064) !== 0 && m !== null)
              ((m.return = i), (L = m));
            else
              e: for (i = f; L !== null; ) {
                if (((u = L), (u.flags & 2048) !== 0))
                  try {
                    switch (u.tag) {
                      case 0:
                      case 11:
                      case 15:
                        _l(9, u);
                    }
                  } catch (j) {
                    ve(u, u.return, j);
                  }
                if (u === i) {
                  L = null;
                  break e;
                }
                var E = u.sibling;
                if (E !== null) {
                  ((E.return = u.return), (L = E));
                  break e;
                }
                L = u.return;
              }
          }
          if (
            ((b = l), Qt(), wt && typeof wt.onPostCommitFiberRoot == "function")
          )
            try {
              wt.onPostCommitFiberRoot(Ar, e);
            } catch {}
          r = !0;
        }
        return r;
      } finally {
        ((ie = n), (at.transition = t));
      }
    }
    return !1;
  }
  function Da(e, t, n) {
    ((t = Fn(n, t)),
      (t = ea(e, t, 1)),
      (e = Gt(e, t, 1)),
      (t = Ke()),
      e !== null && (qn(e, 1, t), qe(e, t)));
  }
  function ve(e, t, n) {
    if (e.tag === 3) Da(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Da(t, e, n);
          break;
        } else if (t.tag === 1) {
          var r = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == "function" ||
            (typeof r.componentDidCatch == "function" &&
              (Xt === null || !Xt.has(r)))
          ) {
            ((e = Fn(n, e)),
              (e = ta(t, e, 1)),
              (t = Gt(t, e, 1)),
              (e = Ke()),
              t !== null && (qn(t, 1, e), qe(t, e)));
            break;
          }
        }
        t = t.return;
      }
  }
  function ld(e, t, n) {
    var r = e.pingCache;
    (r !== null && r.delete(t),
      (t = Ke()),
      (e.pingedLanes |= e.suspendedLanes & n),
      Te === e &&
        (Fe & n) === n &&
        (Ce === 4 || (Ce === 3 && (Fe & 130023424) === Fe && 500 > ye() - Ci)
          ? pn(e, 0)
          : (Ei |= n)),
      qe(e, t));
  }
  function Fa(e, t) {
    t === 0 &&
      ((e.mode & 1) === 0
        ? (t = 1)
        : ((t = Vr), (Vr <<= 1), (Vr & 130023424) === 0 && (Vr = 4194304)));
    var n = Ke();
    ((e = Pt(e, t)), e !== null && (qn(e, t, n), qe(e, n)));
  }
  function od(e) {
    var t = e.memoizedState,
      n = 0;
    (t !== null && (n = t.retryLane), Fa(e, n));
  }
  function id(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode,
          l = e.memoizedState;
        l !== null && (n = l.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(c(314));
    }
    (r !== null && r.delete(t), Fa(e, n));
  }
  var Aa;
  Aa = function (e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps || Xe.current) Ze = !0;
      else {
        if ((e.lanes & n) === 0 && (t.flags & 128) === 0)
          return ((Ze = !1), Kf(e, t, n));
        Ze = (e.flags & 131072) !== 0;
      }
    else ((Ze = !1), de && (t.flags & 1048576) !== 0 && vs(t, sl, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 2:
        var r = t.type;
        (El(e, t), (e = t.pendingProps));
        var l = Rn(t, Ue.current);
        (jn(t, n), (l = ti(null, t, r, e, l, n)));
        var o = ni();
        return (
          (t.flags |= 1),
          typeof l == "object" &&
          l !== null &&
          typeof l.render == "function" &&
          l.$$typeof === void 0
            ? ((t.tag = 1),
              (t.memoizedState = null),
              (t.updateQueue = null),
              Ye(r) ? ((o = !0), ol(t)) : (o = !1),
              (t.memoizedState =
                l.state !== null && l.state !== void 0 ? l.state : null),
              Xo(t),
              (l.updater = xl),
              (t.stateNode = l),
              (l._reactInternals = t),
              si(t, r, e, n),
              (t = di(null, t, r, !0, o, n)))
            : ((t.tag = 0), de && o && Ao(t), Ge(null, t, l, n), (t = t.child)),
          t
        );
      case 16:
        r = t.elementType;
        e: {
          switch (
            (El(e, t),
            (e = t.pendingProps),
            (l = r._init),
            (r = l(r._payload)),
            (t.type = r),
            (l = t.tag = sd(r)),
            (e = mt(r, e)),
            l)
          ) {
            case 0:
              t = fi(null, t, r, e, n);
              break e;
            case 1:
              t = ca(null, t, r, e, n);
              break e;
            case 11:
              t = oa(null, t, r, e, n);
              break e;
            case 14:
              t = ia(null, t, r, mt(r.type, e), n);
              break e;
          }
          throw Error(c(306, r, ""));
        }
        return t;
      case 0:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : mt(r, l)),
          fi(e, t, r, l, n)
        );
      case 1:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : mt(r, l)),
          ca(e, t, r, l, n)
        );
      case 3:
        e: {
          if ((fa(t), e === null)) throw Error(c(387));
          ((r = t.pendingProps),
            (o = t.memoizedState),
            (l = o.element),
            zs(e, t),
            ml(t, r, null, n));
          var i = t.memoizedState;
          if (((r = i.element), o.isDehydrated))
            if (
              ((o = {
                element: r,
                isDehydrated: !1,
                cache: i.cache,
                pendingSuspenseBoundaries: i.pendingSuspenseBoundaries,
                transitions: i.transitions,
              }),
              (t.updateQueue.baseState = o),
              (t.memoizedState = o),
              t.flags & 256)
            ) {
              ((l = Fn(Error(c(423)), t)), (t = da(e, t, r, n, l)));
              break e;
            } else if (r !== l) {
              ((l = Fn(Error(c(424)), t)), (t = da(e, t, r, n, l)));
              break e;
            } else
              for (
                nt = Bt(t.stateNode.containerInfo.firstChild),
                  tt = t,
                  de = !0,
                  pt = null,
                  n = Cs(t, null, r, n),
                  t.child = n;
                n;
              )
                ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
          else {
            if ((Mn(), r === l)) {
              t = Lt(e, t, n);
              break e;
            }
            Ge(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return (
          Rs(t),
          e === null && Bo(t),
          (r = t.type),
          (l = t.pendingProps),
          (o = e !== null ? e.memoizedProps : null),
          (i = l.children),
          Mo(r, l) ? (i = null) : o !== null && Mo(r, o) && (t.flags |= 32),
          aa(e, t),
          Ge(e, t, i, n),
          t.child
        );
      case 6:
        return (e === null && Bo(t), null);
      case 13:
        return pa(e, t, n);
      case 4:
        return (
          Yo(t, t.stateNode.containerInfo),
          (r = t.pendingProps),
          e === null ? (t.child = In(t, null, r, n)) : Ge(e, t, r, n),
          t.child
        );
      case 11:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : mt(r, l)),
          oa(e, t, r, l, n)
        );
      case 7:
        return (Ge(e, t, t.pendingProps, n), t.child);
      case 8:
        return (Ge(e, t, t.pendingProps.children, n), t.child);
      case 12:
        return (Ge(e, t, t.pendingProps.children, n), t.child);
      case 10:
        e: {
          if (
            ((r = t.type._context),
            (l = t.pendingProps),
            (o = t.memoizedProps),
            (i = l.value),
            ue(fl, r._currentValue),
            (r._currentValue = i),
            o !== null)
          )
            if (dt(o.value, i)) {
              if (o.children === l.children && !Xe.current) {
                t = Lt(e, t, n);
                break e;
              }
            } else
              for (o = t.child, o !== null && (o.return = t); o !== null; ) {
                var u = o.dependencies;
                if (u !== null) {
                  i = o.child;
                  for (var a = u.firstContext; a !== null; ) {
                    if (a.context === r) {
                      if (o.tag === 1) {
                        ((a = Rt(-1, n & -n)), (a.tag = 2));
                        var h = o.updateQueue;
                        if (h !== null) {
                          h = h.shared;
                          var k = h.pending;
                          (k === null
                            ? (a.next = a)
                            : ((a.next = k.next), (k.next = a)),
                            (h.pending = a));
                        }
                      }
                      ((o.lanes |= n),
                        (a = o.alternate),
                        a !== null && (a.lanes |= n),
                        Go(o.return, n, t),
                        (u.lanes |= n));
                      break;
                    }
                    a = a.next;
                  }
                } else if (o.tag === 10) i = o.type === t.type ? null : o.child;
                else if (o.tag === 18) {
                  if (((i = o.return), i === null)) throw Error(c(341));
                  ((i.lanes |= n),
                    (u = i.alternate),
                    u !== null && (u.lanes |= n),
                    Go(i, n, t),
                    (i = o.sibling));
                } else i = o.child;
                if (i !== null) i.return = o;
                else
                  for (i = o; i !== null; ) {
                    if (i === t) {
                      i = null;
                      break;
                    }
                    if (((o = i.sibling), o !== null)) {
                      ((o.return = i.return), (i = o));
                      break;
                    }
                    i = i.return;
                  }
                o = i;
              }
          (Ge(e, t, l.children, n), (t = t.child));
        }
        return t;
      case 9:
        return (
          (l = t.type),
          (r = t.pendingProps.children),
          jn(t, n),
          (l = ut(l)),
          (r = r(l)),
          (t.flags |= 1),
          Ge(e, t, r, n),
          t.child
        );
      case 14:
        return (
          (r = t.type),
          (l = mt(r, t.pendingProps)),
          (l = mt(r.type, l)),
          ia(e, t, r, l, n)
        );
      case 15:
        return ua(e, t, t.type, t.pendingProps, n);
      case 17:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : mt(r, l)),
          El(e, t),
          (t.tag = 1),
          Ye(r) ? ((e = !0), ol(t)) : (e = !1),
          jn(t, n),
          qs(t, r, l),
          si(t, r, l, n),
          di(null, t, r, !0, e, n)
        );
      case 19:
        return ha(e, t, n);
      case 22:
        return sa(e, t, n);
    }
    throw Error(c(156, t.tag));
  };
  function Ua(e, t) {
    return yu(e, t);
  }
  function ud(e, t, n, r) {
    ((this.tag = e),
      (this.key = n),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.ref = null),
      (this.pendingProps = t),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = r),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function ct(e, t, n, r) {
    return new ud(e, t, n, r);
  }
  function Mi(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function sd(e) {
    if (typeof e == "function") return Mi(e) ? 1 : 0;
    if (e != null) {
      if (((e = e.$$typeof), e === Qe)) return 11;
      if (e === je) return 14;
    }
    return 2;
  }
  function qt(e, t) {
    var n = e.alternate;
    return (
      n === null
        ? ((n = ct(e.tag, t, e.key, e.mode)),
          (n.elementType = e.elementType),
          (n.type = e.type),
          (n.stateNode = e.stateNode),
          (n.alternate = e),
          (e.alternate = n))
        : ((n.pendingProps = t),
          (n.type = e.type),
          (n.flags = 0),
          (n.subtreeFlags = 0),
          (n.deletions = null)),
      (n.flags = e.flags & 14680064),
      (n.childLanes = e.childLanes),
      (n.lanes = e.lanes),
      (n.child = e.child),
      (n.memoizedProps = e.memoizedProps),
      (n.memoizedState = e.memoizedState),
      (n.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (n.dependencies =
        t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (n.sibling = e.sibling),
      (n.index = e.index),
      (n.ref = e.ref),
      n
    );
  }
  function Ol(e, t, n, r, l, o) {
    var i = 2;
    if (((r = e), typeof e == "function")) Mi(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else
      e: switch (e) {
        case ke:
          return hn(n.children, l, o, t);
        case D:
          ((i = 8), (l |= 8));
          break;
        case Pe:
          return (
            (e = ct(12, n, t, l | 2)),
            (e.elementType = Pe),
            (e.lanes = o),
            e
          );
        case Ae:
          return (
            (e = ct(13, n, t, l)),
            (e.elementType = Ae),
            (e.lanes = o),
            e
          );
        case $e:
          return (
            (e = ct(19, n, t, l)),
            (e.elementType = $e),
            (e.lanes = o),
            e
          );
        case le:
          return jl(n, l, o, t);
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case lt:
                i = 10;
                break e;
              case yt:
                i = 9;
                break e;
              case Qe:
                i = 11;
                break e;
              case je:
                i = 14;
                break e;
              case fe:
                ((i = 16), (r = null));
                break e;
            }
          throw Error(c(130, e == null ? e : typeof e, ""));
      }
    return (
      (t = ct(i, n, t, l)),
      (t.elementType = e),
      (t.type = r),
      (t.lanes = o),
      t
    );
  }
  function hn(e, t, n, r) {
    return ((e = ct(7, e, r, t)), (e.lanes = n), e);
  }
  function jl(e, t, n, r) {
    return (
      (e = ct(22, e, r, t)),
      (e.elementType = le),
      (e.lanes = n),
      (e.stateNode = { isHidden: !1 }),
      e
    );
  }
  function Ii(e, t, n) {
    return ((e = ct(6, e, null, t)), (e.lanes = n), e);
  }
  function Oi(e, t, n) {
    return (
      (t = ct(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = n),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  function ad(e, t, n, r, l) {
    ((this.tag = t),
      (this.containerInfo = e),
      (this.finishedWork =
        this.pingCache =
        this.current =
        this.pendingChildren =
          null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.pendingContext = this.context = null),
      (this.callbackPriority = 0),
      (this.eventTimes = io(0)),
      (this.expirationTimes = io(-1)),
      (this.entangledLanes =
        this.finishedLanes =
        this.mutableReadLanes =
        this.expiredLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = io(0)),
      (this.identifierPrefix = r),
      (this.onRecoverableError = l),
      (this.mutableSourceEagerHydrationData = null));
  }
  function ji(e, t, n, r, l, o, i, u, a) {
    return (
      (e = new ad(e, t, n, u, a)),
      t === 1 ? ((t = 1), o === !0 && (t |= 8)) : (t = 0),
      (o = ct(3, null, null, t)),
      (e.current = o),
      (o.stateNode = e),
      (o.memoizedState = {
        element: r,
        isDehydrated: n,
        cache: null,
        transitions: null,
        pendingSuspenseBoundaries: null,
      }),
      Xo(o),
      e
    );
  }
  function cd(e, t, n) {
    var r =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: me,
      key: r == null ? null : "" + r,
      children: e,
      containerInfo: t,
      implementation: n,
    };
  }
  function Va(e) {
    if (!e) return Ht;
    e = e._reactInternals;
    e: {
      if (nn(e) !== e || e.tag !== 1) throw Error(c(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ye(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(c(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Ye(n)) return ms(e, n, t);
    }
    return t;
  }
  function Ba(e, t, n, r, l, o, i, u, a) {
    return (
      (e = ji(n, r, !0, e, l, o, i, u, a)),
      (e.context = Va(null)),
      (n = e.current),
      (r = Ke()),
      (l = Zt(n)),
      (o = Rt(r, l)),
      (o.callback = t ?? null),
      Gt(n, o, l),
      (e.current.lanes = l),
      qn(e, l, r),
      qe(e, r),
      e
    );
  }
  function Dl(e, t, n, r) {
    var l = t.current,
      o = Ke(),
      i = Zt(l);
    return (
      (n = Va(n)),
      t.context === null ? (t.context = n) : (t.pendingContext = n),
      (t = Rt(o, i)),
      (t.payload = { element: e }),
      (r = r === void 0 ? null : r),
      r !== null && (t.callback = r),
      (e = Gt(l, t, i)),
      e !== null && (vt(e, l, i, o), pl(e, l, i)),
      i
    );
  }
  function Fl(e) {
    if (((e = e.current), !e.child)) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Wa(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Di(e, t) {
    (Wa(e, t), (e = e.alternate) && Wa(e, t));
  }
  function fd() {
    return null;
  }
  var Ha =
    typeof reportError == "function"
      ? reportError
      : function (e) {
          console.error(e);
        };
  function Fi(e) {
    this._internalRoot = e;
  }
  ((Al.prototype.render = Fi.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(c(409));
      Dl(e, t, null, null);
    }),
    (Al.prototype.unmount = Fi.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (dn(function () {
            Dl(null, e, null, null);
          }),
            (t[Ct] = null));
        }
      }));
  function Al(e) {
    this._internalRoot = e;
  }
  Al.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = zu();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < At.length && t !== 0 && t < At[n].priority; n++);
      (At.splice(n, 0, e), n === 0 && Ru(e));
    }
  };
  function Ai(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function Ul(e) {
    return !(
      !e ||
      (e.nodeType !== 1 &&
        e.nodeType !== 9 &&
        e.nodeType !== 11 &&
        (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
    );
  }
  function Qa() {}
  function dd(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function () {
          var h = Fl(i);
          o.call(h);
        };
      }
      var i = Ba(t, r, e, 0, null, !1, !1, "", Qa);
      return (
        (e._reactRootContainer = i),
        (e[Ct] = i.current),
        dr(e.nodeType === 8 ? e.parentNode : e),
        dn(),
        i
      );
    }
    for (; (l = e.lastChild); ) e.removeChild(l);
    if (typeof r == "function") {
      var u = r;
      r = function () {
        var h = Fl(a);
        u.call(h);
      };
    }
    var a = ji(e, 0, !1, null, null, !1, !1, "", Qa);
    return (
      (e._reactRootContainer = a),
      (e[Ct] = a.current),
      dr(e.nodeType === 8 ? e.parentNode : e),
      dn(function () {
        Dl(t, a, n, r);
      }),
      a
    );
  }
  function Vl(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var u = l;
        l = function () {
          var a = Fl(i);
          u.call(a);
        };
      }
      Dl(t, i, e, l);
    } else i = dd(n, t, e, l, r);
    return Fl(i);
  }
  ((Cu = function (e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Jn(t.pendingLanes);
          n !== 0 &&
            (uo(t, n | 1),
            qe(t, ye()),
            (b & 6) === 0 && ((Vn = ye() + 500), Qt()));
        }
        break;
      case 13:
        (dn(function () {
          var r = Pt(e, 1);
          if (r !== null) {
            var l = Ke();
            vt(r, e, 1, l);
          }
        }),
          Di(e, 1));
    }
  }),
    (so = function (e) {
      if (e.tag === 13) {
        var t = Pt(e, 134217728);
        if (t !== null) {
          var n = Ke();
          vt(t, e, 134217728, n);
        }
        Di(e, 134217728);
      }
    }),
    (_u = function (e) {
      if (e.tag === 13) {
        var t = Zt(e),
          n = Pt(e, t);
        if (n !== null) {
          var r = Ke();
          vt(n, e, t, r);
        }
        Di(e, t);
      }
    }),
    (zu = function () {
      return ie;
    }),
    (Nu = function (e, t) {
      var n = ie;
      try {
        return ((ie = e), t());
      } finally {
        ie = n;
      }
    }),
    (eo = function (e, t, n) {
      switch (t) {
        case "input":
          if ((Gl(e, n), (t = n.name), n.type === "radio" && t != null)) {
            for (n = e; n.parentNode; ) n = n.parentNode;
            for (
              n = n.querySelectorAll(
                "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
              ),
                t = 0;
              t < n.length;
              t++
            ) {
              var r = n[t];
              if (r !== e && r.form === e.form) {
                var l = rl(r);
                if (!l) throw Error(c(90));
                (tn(r), Gl(r, l));
              }
            }
          }
          break;
        case "textarea":
          nu(e, n);
          break;
        case "select":
          ((t = n.value), t != null && vn(e, !!n.multiple, t, !1));
      }
    }),
    (fu = Ri),
    (du = dn));
  var pd = { usingClientEntryPoint: !1, Events: [hr, Nn, rl, au, cu, Ri] },
    Rr = {
      findFiberByHostInstance: rn,
      bundleType: 0,
      version: "18.3.1",
      rendererPackageName: "react-dom",
    },
    md = {
      bundleType: Rr.bundleType,
      version: Rr.version,
      rendererPackageName: Rr.rendererPackageName,
      rendererConfig: Rr.rendererConfig,
      overrideHookState: null,
      overrideHookStateDeletePath: null,
      overrideHookStateRenamePath: null,
      overrideProps: null,
      overridePropsDeletePath: null,
      overridePropsRenamePath: null,
      setErrorHandler: null,
      setSuspenseHandler: null,
      scheduleUpdate: null,
      currentDispatcherRef: pe.ReactCurrentDispatcher,
      findHostInstanceByFiber: function (e) {
        return ((e = gu(e)), e === null ? null : e.stateNode);
      },
      findFiberByHostInstance: Rr.findFiberByHostInstance || fd,
      findHostInstancesForRefresh: null,
      scheduleRefresh: null,
      scheduleRoot: null,
      setRefreshHandler: null,
      getCurrentFiber: null,
      reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
    };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Bl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Bl.isDisabled && Bl.supportsFiber)
      try {
        ((Ar = Bl.inject(md)), (wt = Bl));
      } catch {}
  }
  return (
    (be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = pd),
    (be.createPortal = function (e, t) {
      var n =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Ai(t)) throw Error(c(200));
      return cd(e, t, null, n);
    }),
    (be.createRoot = function (e, t) {
      if (!Ai(e)) throw Error(c(299));
      var n = !1,
        r = "",
        l = Ha;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (n = !0),
          t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
          t.onRecoverableError !== void 0 && (l = t.onRecoverableError)),
        (t = ji(e, 1, !1, null, null, n, !1, r, l)),
        (e[Ct] = t.current),
        dr(e.nodeType === 8 ? e.parentNode : e),
        new Fi(t)
      );
    }),
    (be.findDOMNode = function (e) {
      if (e == null) return null;
      if (e.nodeType === 1) return e;
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == "function"
          ? Error(c(188))
          : ((e = Object.keys(e).join(",")), Error(c(268, e)));
      return ((e = gu(t)), (e = e === null ? null : e.stateNode), e);
    }),
    (be.flushSync = function (e) {
      return dn(e);
    }),
    (be.hydrate = function (e, t, n) {
      if (!Ul(t)) throw Error(c(200));
      return Vl(null, e, t, !0, n);
    }),
    (be.hydrateRoot = function (e, t, n) {
      if (!Ai(e)) throw Error(c(405));
      var r = (n != null && n.hydratedSources) || null,
        l = !1,
        o = "",
        i = Ha;
      if (
        (n != null &&
          (n.unstable_strictMode === !0 && (l = !0),
          n.identifierPrefix !== void 0 && (o = n.identifierPrefix),
          n.onRecoverableError !== void 0 && (i = n.onRecoverableError)),
        (t = Ba(t, null, e, 1, n ?? null, l, !1, o, i)),
        (e[Ct] = t.current),
        dr(e),
        r)
      )
        for (e = 0; e < r.length; e++)
          ((n = r[e]),
            (l = n._getVersion),
            (l = l(n._source)),
            t.mutableSourceEagerHydrationData == null
              ? (t.mutableSourceEagerHydrationData = [n, l])
              : t.mutableSourceEagerHydrationData.push(n, l));
      return new Al(t);
    }),
    (be.render = function (e, t, n) {
      if (!Ul(t)) throw Error(c(200));
      return Vl(null, e, t, !1, n);
    }),
    (be.unmountComponentAtNode = function (e) {
      if (!Ul(e)) throw Error(c(40));
      return e._reactRootContainer
        ? (dn(function () {
            Vl(null, null, e, !1, function () {
              ((e._reactRootContainer = null), (e[Ct] = null));
            });
          }),
          !0)
        : !1;
    }),
    (be.unstable_batchedUpdates = Ri),
    (be.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
      if (!Ul(n)) throw Error(c(200));
      if (e == null || e._reactInternals === void 0) throw Error(c(38));
      return Vl(e, t, n, !1, r);
    }),
    (be.version = "18.3.1-next-f1338f8080-20240426"),
    be
  );
}
var qa;
function Sd() {
  if (qa) return Bi.exports;
  qa = 1;
  function s() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (v) {
        console.error(v);
      }
  }
  return (s(), (Bi.exports = xd()), Bi.exports);
}
var ba;
function Ed() {
  if (ba) return Wl;
  ba = 1;
  var s = Sd();
  return ((Wl.createRoot = s.createRoot), (Wl.hydrateRoot = s.hydrateRoot), Wl);
}
var Cd = Ed(),
  It = Yi();
function uc(s) {
  var v,
    c,
    x = "";
  if (typeof s == "string" || typeof s == "number") x += s;
  else if (typeof s == "object")
    if (Array.isArray(s)) {
      var C = s.length;
      for (v = 0; v < C; v++)
        s[v] && (c = uc(s[v])) && (x && (x += " "), (x += c));
    } else for (c in s) s[c] && (x && (x += " "), (x += c));
  return x;
}
function _d() {
  for (var s, v, c = 0, x = "", C = arguments.length; c < C; c++)
    (s = arguments[c]) && (v = uc(s)) && (x && (x += " "), (x += v));
  return x;
}
const Zi = "-",
  zd = (s) => {
    const v = Pd(s),
      { conflictingClassGroups: c, conflictingClassGroupModifiers: x } = s;
    return {
      getClassGroupId: (N) => {
        const W = N.split(Zi);
        return (W[0] === "" && W.length !== 1 && W.shift(), sc(W, v) || Nd(N));
      },
      getConflictingClassGroupIds: (N, W) => {
        const P = c[N] || [];
        return W && x[N] ? [...P, ...x[N]] : P;
      },
    };
  },
  sc = (s, v) => {
    var N;
    if (s.length === 0) return v.classGroupId;
    const c = s[0],
      x = v.nextPart.get(c),
      C = x ? sc(s.slice(1), x) : void 0;
    if (C) return C;
    if (v.validators.length === 0) return;
    const _ = s.join(Zi);
    return (N = v.validators.find(({ validator: W }) => W(_))) == null
      ? void 0
      : N.classGroupId;
  },
  ec = /^\[(.+)\]$/,
  Nd = (s) => {
    if (ec.test(s)) {
      const v = ec.exec(s)[1],
        c = v == null ? void 0 : v.substring(0, v.indexOf(":"));
      if (c) return "arbitrary.." + c;
    }
  },
  Pd = (s) => {
    const { theme: v, classGroups: c } = s,
      x = { nextPart: new Map(), validators: [] };
    for (const C in c) Gi(c[C], x, C, v);
    return x;
  },
  Gi = (s, v, c, x) => {
    s.forEach((C) => {
      if (typeof C == "string") {
        const _ = C === "" ? v : tc(v, C);
        _.classGroupId = c;
        return;
      }
      if (typeof C == "function") {
        if (Rd(C)) {
          Gi(C(x), v, c, x);
          return;
        }
        v.validators.push({ validator: C, classGroupId: c });
        return;
      }
      Object.entries(C).forEach(([_, N]) => {
        Gi(N, tc(v, _), c, x);
      });
    });
  },
  tc = (s, v) => {
    let c = s;
    return (
      v.split(Zi).forEach((x) => {
        (c.nextPart.has(x) ||
          c.nextPart.set(x, { nextPart: new Map(), validators: [] }),
          (c = c.nextPart.get(x)));
      }),
      c
    );
  },
  Rd = (s) => s.isThemeGetter,
  Ld = (s) => {
    if (s < 1) return { get: () => {}, set: () => {} };
    let v = 0,
      c = new Map(),
      x = new Map();
    const C = (_, N) => {
      (c.set(_, N), v++, v > s && ((v = 0), (x = c), (c = new Map())));
    };
    return {
      get(_) {
        let N = c.get(_);
        if (N !== void 0) return N;
        if ((N = x.get(_)) !== void 0) return (C(_, N), N);
      },
      set(_, N) {
        c.has(_) ? c.set(_, N) : C(_, N);
      },
    };
  },
  Ki = "!",
  Xi = ":",
  Td = Xi.length,
  Md = (s) => {
    const { prefix: v, experimentalParseClassName: c } = s;
    let x = (C) => {
      const _ = [];
      let N = 0,
        W = 0,
        P = 0,
        X;
      for (let se = 0; se < C.length; se++) {
        let Y = C[se];
        if (N === 0 && W === 0) {
          if (Y === Xi) {
            (_.push(C.slice(P, se)), (P = se + Td));
            continue;
          }
          if (Y === "/") {
            X = se;
            continue;
          }
        }
        Y === "[" ? N++ : Y === "]" ? N-- : Y === "(" ? W++ : Y === ")" && W--;
      }
      const J = _.length === 0 ? C : C.substring(P),
        ee = Id(J),
        re = ee !== J,
        ze = X && X > P ? X - P : void 0;
      return {
        modifiers: _,
        hasImportantModifier: re,
        baseClassName: ee,
        maybePostfixModifierPosition: ze,
      };
    };
    if (v) {
      const C = v + Xi,
        _ = x;
      x = (N) =>
        N.startsWith(C)
          ? _(N.substring(C.length))
          : {
              isExternal: !0,
              modifiers: [],
              hasImportantModifier: !1,
              baseClassName: N,
              maybePostfixModifierPosition: void 0,
            };
    }
    if (c) {
      const C = x;
      x = (_) => c({ className: _, parseClassName: C });
    }
    return x;
  },
  Id = (s) =>
    s.endsWith(Ki)
      ? s.substring(0, s.length - 1)
      : s.startsWith(Ki)
        ? s.substring(1)
        : s,
  Od = (s) => {
    const v = Object.fromEntries(s.orderSensitiveModifiers.map((x) => [x, !0]));
    return (x) => {
      if (x.length <= 1) return x;
      const C = [];
      let _ = [];
      return (
        x.forEach((N) => {
          N[0] === "[" || v[N] ? (C.push(..._.sort(), N), (_ = [])) : _.push(N);
        }),
        C.push(..._.sort()),
        C
      );
    };
  },
  jd = (s) => ({
    cache: Ld(s.cacheSize),
    parseClassName: Md(s),
    sortModifiers: Od(s),
    ...zd(s),
  }),
  Dd = /\s+/,
  Fd = (s, v) => {
    const {
        parseClassName: c,
        getClassGroupId: x,
        getConflictingClassGroupIds: C,
        sortModifiers: _,
      } = v,
      N = [],
      W = s.trim().split(Dd);
    let P = "";
    for (let X = W.length - 1; X >= 0; X -= 1) {
      const J = W[X],
        {
          isExternal: ee,
          modifiers: re,
          hasImportantModifier: ze,
          baseClassName: se,
          maybePostfixModifierPosition: Y,
        } = c(J);
      if (ee) {
        P = J + (P.length > 0 ? " " + P : P);
        continue;
      }
      let q = !!Y,
        Ie = x(q ? se.substring(0, Y) : se);
      if (!Ie) {
        if (!q) {
          P = J + (P.length > 0 ? " " + P : P);
          continue;
        }
        if (((Ie = x(se)), !Ie)) {
          P = J + (P.length > 0 ? " " + P : P);
          continue;
        }
        q = !1;
      }
      const He = _(re).join(":"),
        Oe = ze ? He + Ki : He,
        pe = Oe + Ie;
      if (N.includes(pe)) continue;
      N.push(pe);
      const Ne = C(Ie, q);
      for (let me = 0; me < Ne.length; ++me) {
        const ke = Ne[me];
        N.push(Oe + ke);
      }
      P = J + (P.length > 0 ? " " + P : P);
    }
    return P;
  };
function Ad() {
  let s = 0,
    v,
    c,
    x = "";
  for (; s < arguments.length; )
    (v = arguments[s++]) && (c = ac(v)) && (x && (x += " "), (x += c));
  return x;
}
const ac = (s) => {
  if (typeof s == "string") return s;
  let v,
    c = "";
  for (let x = 0; x < s.length; x++)
    s[x] && (v = ac(s[x])) && (c && (c += " "), (c += v));
  return c;
};
function Ud(s, ...v) {
  let c,
    x,
    C,
    _ = N;
  function N(P) {
    const X = v.reduce((J, ee) => ee(J), s());
    return ((c = jd(X)), (x = c.cache.get), (C = c.cache.set), (_ = W), W(P));
  }
  function W(P) {
    const X = x(P);
    if (X) return X;
    const J = Fd(P, c);
    return (C(P, J), J);
  }
  return function () {
    return _(Ad.apply(null, arguments));
  };
}
const _e = (s) => {
    const v = (c) => c[s] || [];
    return ((v.isThemeGetter = !0), v);
  },
  cc = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  fc = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  Vd = /^\d+\/\d+$/,
  Bd = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  Wd =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  Hd = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,
  Qd = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  $d =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  Wn = (s) => Vd.test(s),
  $ = (s) => !!s && !Number.isNaN(Number(s)),
  en = (s) => !!s && Number.isInteger(Number(s)),
  Qi = (s) => s.endsWith("%") && $(s.slice(0, -1)),
  Mt = (s) => Bd.test(s),
  Gd = () => !0,
  Kd = (s) => Wd.test(s) && !Hd.test(s),
  dc = () => !1,
  Xd = (s) => Qd.test(s),
  Yd = (s) => $d.test(s),
  Zd = (s) => !M(s) && !I(s),
  Jd = (s) => Hn(s, hc, dc),
  M = (s) => cc.test(s),
  gn = (s) => Hn(s, gc, Kd),
  $i = (s) => Hn(s, np, $),
  nc = (s) => Hn(s, pc, dc),
  qd = (s) => Hn(s, mc, Yd),
  Hl = (s) => Hn(s, vc, Xd),
  I = (s) => fc.test(s),
  Tr = (s) => Qn(s, gc),
  bd = (s) => Qn(s, rp),
  rc = (s) => Qn(s, pc),
  ep = (s) => Qn(s, hc),
  tp = (s) => Qn(s, mc),
  Ql = (s) => Qn(s, vc, !0),
  Hn = (s, v, c) => {
    const x = cc.exec(s);
    return x ? (x[1] ? v(x[1]) : c(x[2])) : !1;
  },
  Qn = (s, v, c = !1) => {
    const x = fc.exec(s);
    return x ? (x[1] ? v(x[1]) : c) : !1;
  },
  pc = (s) => s === "position" || s === "percentage",
  mc = (s) => s === "image" || s === "url",
  hc = (s) => s === "length" || s === "size" || s === "bg-size",
  gc = (s) => s === "length",
  np = (s) => s === "number",
  rp = (s) => s === "family-name",
  vc = (s) => s === "shadow",
  lp = () => {
    const s = _e("color"),
      v = _e("font"),
      c = _e("text"),
      x = _e("font-weight"),
      C = _e("tracking"),
      _ = _e("leading"),
      N = _e("breakpoint"),
      W = _e("container"),
      P = _e("spacing"),
      X = _e("radius"),
      J = _e("shadow"),
      ee = _e("inset-shadow"),
      re = _e("text-shadow"),
      ze = _e("drop-shadow"),
      se = _e("blur"),
      Y = _e("perspective"),
      q = _e("aspect"),
      Ie = _e("ease"),
      He = _e("animate"),
      Oe = () => [
        "auto",
        "avoid",
        "all",
        "avoid-page",
        "page",
        "left",
        "right",
        "column",
      ],
      pe = () => [
        "center",
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "left-top",
        "top-right",
        "right-top",
        "bottom-right",
        "right-bottom",
        "bottom-left",
        "left-bottom",
      ],
      Ne = () => [...pe(), I, M],
      me = () => ["auto", "hidden", "clip", "visible", "scroll"],
      ke = () => ["auto", "contain", "none"],
      D = () => [I, M, P],
      Pe = () => [Wn, "full", "auto", ...D()],
      lt = () => [en, "none", "subgrid", I, M],
      yt = () => ["auto", { span: ["full", en, I, M] }, en, I, M],
      Qe = () => [en, "auto", I, M],
      Ae = () => ["auto", "min", "max", "fr", I, M],
      $e = () => [
        "start",
        "end",
        "center",
        "between",
        "around",
        "evenly",
        "stretch",
        "baseline",
        "center-safe",
        "end-safe",
      ],
      je = () => [
        "start",
        "end",
        "center",
        "stretch",
        "center-safe",
        "end-safe",
      ],
      fe = () => ["auto", ...D()],
      le = () => [
        Wn,
        "auto",
        "full",
        "dvw",
        "dvh",
        "lvw",
        "lvh",
        "svw",
        "svh",
        "min",
        "max",
        "fit",
        ...D(),
      ],
      g = () => [s, I, M],
      A = () => [...pe(), rc, nc, { position: [I, M] }],
      R = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }],
      d = () => ["auto", "cover", "contain", ep, Jd, { size: [I, M] }],
      y = () => [Qi, Tr, gn],
      F = () => ["", "none", "full", X, I, M],
      B = () => ["", $, Tr, gn],
      K = () => ["solid", "dashed", "dotted", "double"],
      Z = () => [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
      ],
      Q = () => [$, Qi, rc, nc],
      te = () => ["", "none", se, I, M],
      oe = () => ["none", $, I, M],
      Re = () => ["none", $, I, M],
      Ot = () => [$, I, M],
      tn = () => [Wn, "full", ...D()];
    return {
      cacheSize: 500,
      theme: {
        animate: ["spin", "ping", "pulse", "bounce"],
        aspect: ["video"],
        blur: [Mt],
        breakpoint: [Mt],
        color: [Gd],
        container: [Mt],
        "drop-shadow": [Mt],
        ease: ["in", "out", "in-out"],
        font: [Zd],
        "font-weight": [
          "thin",
          "extralight",
          "light",
          "normal",
          "medium",
          "semibold",
          "bold",
          "extrabold",
          "black",
        ],
        "inset-shadow": [Mt],
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
        perspective: [
          "dramatic",
          "near",
          "normal",
          "midrange",
          "distant",
          "none",
        ],
        radius: [Mt],
        shadow: [Mt],
        spacing: ["px", $],
        text: [Mt],
        "text-shadow": [Mt],
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"],
      },
      classGroups: {
        aspect: [{ aspect: ["auto", "square", Wn, M, I, q] }],
        container: ["container"],
        columns: [{ columns: [$, M, I, W] }],
        "break-after": [{ "break-after": Oe() }],
        "break-before": [{ "break-before": Oe() }],
        "break-inside": [
          { "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] },
        ],
        "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
        box: [{ box: ["border", "content"] }],
        display: [
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "table",
          "inline-table",
          "table-caption",
          "table-cell",
          "table-column",
          "table-column-group",
          "table-footer-group",
          "table-header-group",
          "table-row-group",
          "table-row",
          "flow-root",
          "grid",
          "inline-grid",
          "contents",
          "list-item",
          "hidden",
        ],
        sr: ["sr-only", "not-sr-only"],
        float: [{ float: ["right", "left", "none", "start", "end"] }],
        clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
        isolation: ["isolate", "isolation-auto"],
        "object-fit": [
          { object: ["contain", "cover", "fill", "none", "scale-down"] },
        ],
        "object-position": [{ object: Ne() }],
        overflow: [{ overflow: me() }],
        "overflow-x": [{ "overflow-x": me() }],
        "overflow-y": [{ "overflow-y": me() }],
        overscroll: [{ overscroll: ke() }],
        "overscroll-x": [{ "overscroll-x": ke() }],
        "overscroll-y": [{ "overscroll-y": ke() }],
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        inset: [{ inset: Pe() }],
        "inset-x": [{ "inset-x": Pe() }],
        "inset-y": [{ "inset-y": Pe() }],
        start: [{ start: Pe() }],
        end: [{ end: Pe() }],
        top: [{ top: Pe() }],
        right: [{ right: Pe() }],
        bottom: [{ bottom: Pe() }],
        left: [{ left: Pe() }],
        visibility: ["visible", "invisible", "collapse"],
        z: [{ z: [en, "auto", I, M] }],
        basis: [{ basis: [Wn, "full", "auto", W, ...D()] }],
        "flex-direction": [
          { flex: ["row", "row-reverse", "col", "col-reverse"] },
        ],
        "flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }],
        flex: [{ flex: [$, Wn, "auto", "initial", "none", M] }],
        grow: [{ grow: ["", $, I, M] }],
        shrink: [{ shrink: ["", $, I, M] }],
        order: [{ order: [en, "first", "last", "none", I, M] }],
        "grid-cols": [{ "grid-cols": lt() }],
        "col-start-end": [{ col: yt() }],
        "col-start": [{ "col-start": Qe() }],
        "col-end": [{ "col-end": Qe() }],
        "grid-rows": [{ "grid-rows": lt() }],
        "row-start-end": [{ row: yt() }],
        "row-start": [{ "row-start": Qe() }],
        "row-end": [{ "row-end": Qe() }],
        "grid-flow": [
          { "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] },
        ],
        "auto-cols": [{ "auto-cols": Ae() }],
        "auto-rows": [{ "auto-rows": Ae() }],
        gap: [{ gap: D() }],
        "gap-x": [{ "gap-x": D() }],
        "gap-y": [{ "gap-y": D() }],
        "justify-content": [{ justify: [...$e(), "normal"] }],
        "justify-items": [{ "justify-items": [...je(), "normal"] }],
        "justify-self": [{ "justify-self": ["auto", ...je()] }],
        "align-content": [{ content: ["normal", ...$e()] }],
        "align-items": [{ items: [...je(), { baseline: ["", "last"] }] }],
        "align-self": [{ self: ["auto", ...je(), { baseline: ["", "last"] }] }],
        "place-content": [{ "place-content": $e() }],
        "place-items": [{ "place-items": [...je(), "baseline"] }],
        "place-self": [{ "place-self": ["auto", ...je()] }],
        p: [{ p: D() }],
        px: [{ px: D() }],
        py: [{ py: D() }],
        ps: [{ ps: D() }],
        pe: [{ pe: D() }],
        pt: [{ pt: D() }],
        pr: [{ pr: D() }],
        pb: [{ pb: D() }],
        pl: [{ pl: D() }],
        m: [{ m: fe() }],
        mx: [{ mx: fe() }],
        my: [{ my: fe() }],
        ms: [{ ms: fe() }],
        me: [{ me: fe() }],
        mt: [{ mt: fe() }],
        mr: [{ mr: fe() }],
        mb: [{ mb: fe() }],
        ml: [{ ml: fe() }],
        "space-x": [{ "space-x": D() }],
        "space-x-reverse": ["space-x-reverse"],
        "space-y": [{ "space-y": D() }],
        "space-y-reverse": ["space-y-reverse"],
        size: [{ size: le() }],
        w: [{ w: [W, "screen", ...le()] }],
        "min-w": [{ "min-w": [W, "screen", "none", ...le()] }],
        "max-w": [
          { "max-w": [W, "screen", "none", "prose", { screen: [N] }, ...le()] },
        ],
        h: [{ h: ["screen", ...le()] }],
        "min-h": [{ "min-h": ["screen", "none", ...le()] }],
        "max-h": [{ "max-h": ["screen", ...le()] }],
        "font-size": [{ text: ["base", c, Tr, gn] }],
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        "font-style": ["italic", "not-italic"],
        "font-weight": [{ font: [x, I, $i] }],
        "font-stretch": [
          {
            "font-stretch": [
              "ultra-condensed",
              "extra-condensed",
              "condensed",
              "semi-condensed",
              "normal",
              "semi-expanded",
              "expanded",
              "extra-expanded",
              "ultra-expanded",
              Qi,
              M,
            ],
          },
        ],
        "font-family": [{ font: [bd, M, v] }],
        "fvn-normal": ["normal-nums"],
        "fvn-ordinal": ["ordinal"],
        "fvn-slashed-zero": ["slashed-zero"],
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        tracking: [{ tracking: [C, I, M] }],
        "line-clamp": [{ "line-clamp": [$, "none", I, $i] }],
        leading: [{ leading: [_, ...D()] }],
        "list-image": [{ "list-image": ["none", I, M] }],
        "list-style-position": [{ list: ["inside", "outside"] }],
        "list-style-type": [{ list: ["disc", "decimal", "none", I, M] }],
        "text-alignment": [
          { text: ["left", "center", "right", "justify", "start", "end"] },
        ],
        "placeholder-color": [{ placeholder: g() }],
        "text-color": [{ text: g() }],
        "text-decoration": [
          "underline",
          "overline",
          "line-through",
          "no-underline",
        ],
        "text-decoration-style": [{ decoration: [...K(), "wavy"] }],
        "text-decoration-thickness": [
          { decoration: [$, "from-font", "auto", I, gn] },
        ],
        "text-decoration-color": [{ decoration: g() }],
        "underline-offset": [{ "underline-offset": [$, "auto", I, M] }],
        "text-transform": [
          "uppercase",
          "lowercase",
          "capitalize",
          "normal-case",
        ],
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
        indent: [{ indent: D() }],
        "vertical-align": [
          {
            align: [
              "baseline",
              "top",
              "middle",
              "bottom",
              "text-top",
              "text-bottom",
              "sub",
              "super",
              I,
              M,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              "normal",
              "nowrap",
              "pre",
              "pre-line",
              "pre-wrap",
              "break-spaces",
            ],
          },
        ],
        break: [{ break: ["normal", "words", "all", "keep"] }],
        wrap: [{ wrap: ["break-word", "anywhere", "normal"] }],
        hyphens: [{ hyphens: ["none", "manual", "auto"] }],
        content: [{ content: ["none", I, M] }],
        "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
        "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
        "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
        "bg-position": [{ bg: A() }],
        "bg-repeat": [{ bg: R() }],
        "bg-size": [{ bg: d() }],
        "bg-image": [
          {
            bg: [
              "none",
              {
                linear: [
                  { to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] },
                  en,
                  I,
                  M,
                ],
                radial: ["", I, M],
                conic: [en, I, M],
              },
              tp,
              qd,
            ],
          },
        ],
        "bg-color": [{ bg: g() }],
        "gradient-from-pos": [{ from: y() }],
        "gradient-via-pos": [{ via: y() }],
        "gradient-to-pos": [{ to: y() }],
        "gradient-from": [{ from: g() }],
        "gradient-via": [{ via: g() }],
        "gradient-to": [{ to: g() }],
        rounded: [{ rounded: F() }],
        "rounded-s": [{ "rounded-s": F() }],
        "rounded-e": [{ "rounded-e": F() }],
        "rounded-t": [{ "rounded-t": F() }],
        "rounded-r": [{ "rounded-r": F() }],
        "rounded-b": [{ "rounded-b": F() }],
        "rounded-l": [{ "rounded-l": F() }],
        "rounded-ss": [{ "rounded-ss": F() }],
        "rounded-se": [{ "rounded-se": F() }],
        "rounded-ee": [{ "rounded-ee": F() }],
        "rounded-es": [{ "rounded-es": F() }],
        "rounded-tl": [{ "rounded-tl": F() }],
        "rounded-tr": [{ "rounded-tr": F() }],
        "rounded-br": [{ "rounded-br": F() }],
        "rounded-bl": [{ "rounded-bl": F() }],
        "border-w": [{ border: B() }],
        "border-w-x": [{ "border-x": B() }],
        "border-w-y": [{ "border-y": B() }],
        "border-w-s": [{ "border-s": B() }],
        "border-w-e": [{ "border-e": B() }],
        "border-w-t": [{ "border-t": B() }],
        "border-w-r": [{ "border-r": B() }],
        "border-w-b": [{ "border-b": B() }],
        "border-w-l": [{ "border-l": B() }],
        "divide-x": [{ "divide-x": B() }],
        "divide-x-reverse": ["divide-x-reverse"],
        "divide-y": [{ "divide-y": B() }],
        "divide-y-reverse": ["divide-y-reverse"],
        "border-style": [{ border: [...K(), "hidden", "none"] }],
        "divide-style": [{ divide: [...K(), "hidden", "none"] }],
        "border-color": [{ border: g() }],
        "border-color-x": [{ "border-x": g() }],
        "border-color-y": [{ "border-y": g() }],
        "border-color-s": [{ "border-s": g() }],
        "border-color-e": [{ "border-e": g() }],
        "border-color-t": [{ "border-t": g() }],
        "border-color-r": [{ "border-r": g() }],
        "border-color-b": [{ "border-b": g() }],
        "border-color-l": [{ "border-l": g() }],
        "divide-color": [{ divide: g() }],
        "outline-style": [{ outline: [...K(), "none", "hidden"] }],
        "outline-offset": [{ "outline-offset": [$, I, M] }],
        "outline-w": [{ outline: ["", $, Tr, gn] }],
        "outline-color": [{ outline: g() }],
        shadow: [{ shadow: ["", "none", J, Ql, Hl] }],
        "shadow-color": [{ shadow: g() }],
        "inset-shadow": [{ "inset-shadow": ["none", ee, Ql, Hl] }],
        "inset-shadow-color": [{ "inset-shadow": g() }],
        "ring-w": [{ ring: B() }],
        "ring-w-inset": ["ring-inset"],
        "ring-color": [{ ring: g() }],
        "ring-offset-w": [{ "ring-offset": [$, gn] }],
        "ring-offset-color": [{ "ring-offset": g() }],
        "inset-ring-w": [{ "inset-ring": B() }],
        "inset-ring-color": [{ "inset-ring": g() }],
        "text-shadow": [{ "text-shadow": ["none", re, Ql, Hl] }],
        "text-shadow-color": [{ "text-shadow": g() }],
        opacity: [{ opacity: [$, I, M] }],
        "mix-blend": [{ "mix-blend": [...Z(), "plus-darker", "plus-lighter"] }],
        "bg-blend": [{ "bg-blend": Z() }],
        "mask-clip": [
          {
            "mask-clip": [
              "border",
              "padding",
              "content",
              "fill",
              "stroke",
              "view",
            ],
          },
          "mask-no-clip",
        ],
        "mask-composite": [
          { mask: ["add", "subtract", "intersect", "exclude"] },
        ],
        "mask-image-linear-pos": [{ "mask-linear": [$] }],
        "mask-image-linear-from-pos": [{ "mask-linear-from": Q() }],
        "mask-image-linear-to-pos": [{ "mask-linear-to": Q() }],
        "mask-image-linear-from-color": [{ "mask-linear-from": g() }],
        "mask-image-linear-to-color": [{ "mask-linear-to": g() }],
        "mask-image-t-from-pos": [{ "mask-t-from": Q() }],
        "mask-image-t-to-pos": [{ "mask-t-to": Q() }],
        "mask-image-t-from-color": [{ "mask-t-from": g() }],
        "mask-image-t-to-color": [{ "mask-t-to": g() }],
        "mask-image-r-from-pos": [{ "mask-r-from": Q() }],
        "mask-image-r-to-pos": [{ "mask-r-to": Q() }],
        "mask-image-r-from-color": [{ "mask-r-from": g() }],
        "mask-image-r-to-color": [{ "mask-r-to": g() }],
        "mask-image-b-from-pos": [{ "mask-b-from": Q() }],
        "mask-image-b-to-pos": [{ "mask-b-to": Q() }],
        "mask-image-b-from-color": [{ "mask-b-from": g() }],
        "mask-image-b-to-color": [{ "mask-b-to": g() }],
        "mask-image-l-from-pos": [{ "mask-l-from": Q() }],
        "mask-image-l-to-pos": [{ "mask-l-to": Q() }],
        "mask-image-l-from-color": [{ "mask-l-from": g() }],
        "mask-image-l-to-color": [{ "mask-l-to": g() }],
        "mask-image-x-from-pos": [{ "mask-x-from": Q() }],
        "mask-image-x-to-pos": [{ "mask-x-to": Q() }],
        "mask-image-x-from-color": [{ "mask-x-from": g() }],
        "mask-image-x-to-color": [{ "mask-x-to": g() }],
        "mask-image-y-from-pos": [{ "mask-y-from": Q() }],
        "mask-image-y-to-pos": [{ "mask-y-to": Q() }],
        "mask-image-y-from-color": [{ "mask-y-from": g() }],
        "mask-image-y-to-color": [{ "mask-y-to": g() }],
        "mask-image-radial": [{ "mask-radial": [I, M] }],
        "mask-image-radial-from-pos": [{ "mask-radial-from": Q() }],
        "mask-image-radial-to-pos": [{ "mask-radial-to": Q() }],
        "mask-image-radial-from-color": [{ "mask-radial-from": g() }],
        "mask-image-radial-to-color": [{ "mask-radial-to": g() }],
        "mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
        "mask-image-radial-size": [
          {
            "mask-radial": [
              { closest: ["side", "corner"], farthest: ["side", "corner"] },
            ],
          },
        ],
        "mask-image-radial-pos": [{ "mask-radial-at": pe() }],
        "mask-image-conic-pos": [{ "mask-conic": [$] }],
        "mask-image-conic-from-pos": [{ "mask-conic-from": Q() }],
        "mask-image-conic-to-pos": [{ "mask-conic-to": Q() }],
        "mask-image-conic-from-color": [{ "mask-conic-from": g() }],
        "mask-image-conic-to-color": [{ "mask-conic-to": g() }],
        "mask-mode": [{ mask: ["alpha", "luminance", "match"] }],
        "mask-origin": [
          {
            "mask-origin": [
              "border",
              "padding",
              "content",
              "fill",
              "stroke",
              "view",
            ],
          },
        ],
        "mask-position": [{ mask: A() }],
        "mask-repeat": [{ mask: R() }],
        "mask-size": [{ mask: d() }],
        "mask-type": [{ "mask-type": ["alpha", "luminance"] }],
        "mask-image": [{ mask: ["none", I, M] }],
        filter: [{ filter: ["", "none", I, M] }],
        blur: [{ blur: te() }],
        brightness: [{ brightness: [$, I, M] }],
        contrast: [{ contrast: [$, I, M] }],
        "drop-shadow": [{ "drop-shadow": ["", "none", ze, Ql, Hl] }],
        "drop-shadow-color": [{ "drop-shadow": g() }],
        grayscale: [{ grayscale: ["", $, I, M] }],
        "hue-rotate": [{ "hue-rotate": [$, I, M] }],
        invert: [{ invert: ["", $, I, M] }],
        saturate: [{ saturate: [$, I, M] }],
        sepia: [{ sepia: ["", $, I, M] }],
        "backdrop-filter": [{ "backdrop-filter": ["", "none", I, M] }],
        "backdrop-blur": [{ "backdrop-blur": te() }],
        "backdrop-brightness": [{ "backdrop-brightness": [$, I, M] }],
        "backdrop-contrast": [{ "backdrop-contrast": [$, I, M] }],
        "backdrop-grayscale": [{ "backdrop-grayscale": ["", $, I, M] }],
        "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [$, I, M] }],
        "backdrop-invert": [{ "backdrop-invert": ["", $, I, M] }],
        "backdrop-opacity": [{ "backdrop-opacity": [$, I, M] }],
        "backdrop-saturate": [{ "backdrop-saturate": [$, I, M] }],
        "backdrop-sepia": [{ "backdrop-sepia": ["", $, I, M] }],
        "border-collapse": [{ border: ["collapse", "separate"] }],
        "border-spacing": [{ "border-spacing": D() }],
        "border-spacing-x": [{ "border-spacing-x": D() }],
        "border-spacing-y": [{ "border-spacing-y": D() }],
        "table-layout": [{ table: ["auto", "fixed"] }],
        caption: [{ caption: ["top", "bottom"] }],
        transition: [
          {
            transition: [
              "",
              "all",
              "colors",
              "opacity",
              "shadow",
              "transform",
              "none",
              I,
              M,
            ],
          },
        ],
        "transition-behavior": [{ transition: ["normal", "discrete"] }],
        duration: [{ duration: [$, "initial", I, M] }],
        ease: [{ ease: ["linear", "initial", Ie, I, M] }],
        delay: [{ delay: [$, I, M] }],
        animate: [{ animate: ["none", He, I, M] }],
        backface: [{ backface: ["hidden", "visible"] }],
        perspective: [{ perspective: [Y, I, M] }],
        "perspective-origin": [{ "perspective-origin": Ne() }],
        rotate: [{ rotate: oe() }],
        "rotate-x": [{ "rotate-x": oe() }],
        "rotate-y": [{ "rotate-y": oe() }],
        "rotate-z": [{ "rotate-z": oe() }],
        scale: [{ scale: Re() }],
        "scale-x": [{ "scale-x": Re() }],
        "scale-y": [{ "scale-y": Re() }],
        "scale-z": [{ "scale-z": Re() }],
        "scale-3d": ["scale-3d"],
        skew: [{ skew: Ot() }],
        "skew-x": [{ "skew-x": Ot() }],
        "skew-y": [{ "skew-y": Ot() }],
        transform: [{ transform: [I, M, "", "none", "gpu", "cpu"] }],
        "transform-origin": [{ origin: Ne() }],
        "transform-style": [{ transform: ["3d", "flat"] }],
        translate: [{ translate: tn() }],
        "translate-x": [{ "translate-x": tn() }],
        "translate-y": [{ "translate-y": tn() }],
        "translate-z": [{ "translate-z": tn() }],
        "translate-none": ["translate-none"],
        accent: [{ accent: g() }],
        appearance: [{ appearance: ["none", "auto"] }],
        "caret-color": [{ caret: g() }],
        "color-scheme": [
          {
            scheme: [
              "normal",
              "dark",
              "light",
              "light-dark",
              "only-dark",
              "only-light",
            ],
          },
        ],
        cursor: [
          {
            cursor: [
              "auto",
              "default",
              "pointer",
              "wait",
              "text",
              "move",
              "help",
              "not-allowed",
              "none",
              "context-menu",
              "progress",
              "cell",
              "crosshair",
              "vertical-text",
              "alias",
              "copy",
              "no-drop",
              "grab",
              "grabbing",
              "all-scroll",
              "col-resize",
              "row-resize",
              "n-resize",
              "e-resize",
              "s-resize",
              "w-resize",
              "ne-resize",
              "nw-resize",
              "se-resize",
              "sw-resize",
              "ew-resize",
              "ns-resize",
              "nesw-resize",
              "nwse-resize",
              "zoom-in",
              "zoom-out",
              I,
              M,
            ],
          },
        ],
        "field-sizing": [{ "field-sizing": ["fixed", "content"] }],
        "pointer-events": [{ "pointer-events": ["auto", "none"] }],
        resize: [{ resize: ["none", "", "y", "x"] }],
        "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
        "scroll-m": [{ "scroll-m": D() }],
        "scroll-mx": [{ "scroll-mx": D() }],
        "scroll-my": [{ "scroll-my": D() }],
        "scroll-ms": [{ "scroll-ms": D() }],
        "scroll-me": [{ "scroll-me": D() }],
        "scroll-mt": [{ "scroll-mt": D() }],
        "scroll-mr": [{ "scroll-mr": D() }],
        "scroll-mb": [{ "scroll-mb": D() }],
        "scroll-ml": [{ "scroll-ml": D() }],
        "scroll-p": [{ "scroll-p": D() }],
        "scroll-px": [{ "scroll-px": D() }],
        "scroll-py": [{ "scroll-py": D() }],
        "scroll-ps": [{ "scroll-ps": D() }],
        "scroll-pe": [{ "scroll-pe": D() }],
        "scroll-pt": [{ "scroll-pt": D() }],
        "scroll-pr": [{ "scroll-pr": D() }],
        "scroll-pb": [{ "scroll-pb": D() }],
        "scroll-pl": [{ "scroll-pl": D() }],
        "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
        "snap-stop": [{ snap: ["normal", "always"] }],
        "snap-type": [{ snap: ["none", "x", "y", "both"] }],
        "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
        touch: [{ touch: ["auto", "none", "manipulation"] }],
        "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
        "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
        "touch-pz": ["touch-pinch-zoom"],
        select: [{ select: ["none", "text", "all", "auto"] }],
        "will-change": [
          { "will-change": ["auto", "scroll", "contents", "transform", I, M] },
        ],
        fill: [{ fill: ["none", ...g()] }],
        "stroke-w": [{ stroke: [$, Tr, gn, $i] }],
        stroke: [{ stroke: ["none", ...g()] }],
        "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: [
          "inset-x",
          "inset-y",
          "start",
          "end",
          "top",
          "right",
          "bottom",
          "left",
        ],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": [
          "fvn-ordinal",
          "fvn-slashed-zero",
          "fvn-figure",
          "fvn-spacing",
          "fvn-fraction",
        ],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: [
          "rounded-s",
          "rounded-e",
          "rounded-t",
          "rounded-r",
          "rounded-b",
          "rounded-l",
          "rounded-ss",
          "rounded-se",
          "rounded-ee",
          "rounded-es",
          "rounded-tl",
          "rounded-tr",
          "rounded-br",
          "rounded-bl",
        ],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": [
          "border-w-x",
          "border-w-y",
          "border-w-s",
          "border-w-e",
          "border-w-t",
          "border-w-r",
          "border-w-b",
          "border-w-l",
        ],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": [
          "border-color-x",
          "border-color-y",
          "border-color-s",
          "border-color-e",
          "border-color-t",
          "border-color-r",
          "border-color-b",
          "border-color-l",
        ],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        translate: ["translate-x", "translate-y", "translate-none"],
        "translate-none": [
          "translate",
          "translate-x",
          "translate-y",
          "translate-z",
        ],
        "scroll-m": [
          "scroll-mx",
          "scroll-my",
          "scroll-ms",
          "scroll-me",
          "scroll-mt",
          "scroll-mr",
          "scroll-mb",
          "scroll-ml",
        ],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": [
          "scroll-px",
          "scroll-py",
          "scroll-ps",
          "scroll-pe",
          "scroll-pt",
          "scroll-pr",
          "scroll-pb",
          "scroll-pl",
        ],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"],
      },
      conflictingClassGroupModifiers: { "font-size": ["leading"] },
      orderSensitiveModifiers: [
        "*",
        "**",
        "after",
        "backdrop",
        "before",
        "details-content",
        "file",
        "first-letter",
        "first-line",
        "marker",
        "placeholder",
        "selection",
      ],
    };
  },
  op = Ud(lp);
function Mr(...s) {
  return op(_d(s));
}
function ip({ className: s, ...v }) {
  return Se.jsx("div", {
    "data-slot": "card",
    className: Mr(
      "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
      s,
    ),
    ...v,
  });
}
function up({ className: s, ...v }) {
  return Se.jsx("div", {
    "data-slot": "card-header",
    className: Mr(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      s,
    ),
    ...v,
  });
}
function sp({ className: s, ...v }) {
  return Se.jsx("h4", {
    "data-slot": "card-title",
    className: Mr("leading-none", s),
    ...v,
  });
}
function ap({ className: s, ...v }) {
  return Se.jsx("p", {
    "data-slot": "card-description",
    className: Mr("text-muted-foreground", s),
    ...v,
  });
}
function cp({ className: s, ...v }) {
  return Se.jsx("div", {
    "data-slot": "card-content",
    className: Mr("px-6 [&:last-child]:pb-6", s),
    ...v,
  });
}
const fp = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  dp = (s) =>
    s.replace(/^([A-Z])|[\s-_]+(\w)/g, (v, c, x) =>
      x ? x.toUpperCase() : c.toLowerCase(),
    ),
  lc = (s) => {
    const v = dp(s);
    return v.charAt(0).toUpperCase() + v.slice(1);
  },
  yc = (...s) =>
    s
      .filter((v, c, x) => !!v && v.trim() !== "" && x.indexOf(v) === c)
      .join(" ")
      .trim();
var pp = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const mp = It.forwardRef(
  (
    {
      color: s = "currentColor",
      size: v = 24,
      strokeWidth: c = 2,
      absoluteStrokeWidth: x,
      className: C = "",
      children: _,
      iconNode: N,
      ...W
    },
    P,
  ) =>
    It.createElement(
      "svg",
      {
        ref: P,
        ...pp,
        width: v,
        height: v,
        stroke: s,
        strokeWidth: x ? (Number(c) * 24) / Number(v) : c,
        className: yc("lucide", C),
        ...W,
      },
      [
        ...N.map(([X, J]) => It.createElement(X, J)),
        ...(Array.isArray(_) ? _ : [_]),
      ],
    ),
);
const Ji = (s, v) => {
  const c = It.forwardRef(({ className: x, ...C }, _) =>
    It.createElement(mp, {
      ref: _,
      iconNode: v,
      className: yc(`lucide-${fp(lc(s))}`, `lucide-${s}`, x),
      ...C,
    }),
  );
  return ((c.displayName = lc(s)), c);
};
const hp = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }],
  ],
  gp = Ji("circle-alert", hp);
const vp = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
  ],
  yp = Ji("circle-check", vp);
const wp = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
    ["path", { d: "m9 9 6 6", key: "z0biqf" }],
  ],
  kp = Ji("circle-x", wp),
  oc = {
    success: "Email của bạn đã được xác thực thành công!",
    expired: "Liên kết đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.",
  },
  ic = {
    success: "Xác thực email thành công",
    expired: "Xác thực email không thành công",
  };
function xp() {
  const [s, v] = It.useState("loading"),
    [c, x] = It.useState("success"),
    [C, _] = It.useState("");
  return (
    It.useEffect(() => {
      var X;
      document.title = "Dang xac thuc email";
      const N = new URLSearchParams(window.location.search),
        W = (X = N.get("success")) == null ? void 0 : X.toLowerCase().trim(),
        P = N.get("message") || N.get("error");
      if (W === "true") {
        (x("success"),
          _(P || oc.success),
          (document.title = ic.success),
          v("ready"));
        return;
      }
      (x("expired"),
        _(P || oc.expired),
        (document.title = ic.expired),
        v("ready"));
    }, []),
    Se.jsx("div", {
      className:
        "size-full flex items-center justify-center bg-gradient-to-br from-cam-50 to-cam-100 p-4",
      children: Se.jsxs(ip, {
        className: "w-full max-w-md shadow-lg",
        children: [
          Se.jsxs(up, {
            className: "text-center pb-3",
            children: [
              Se.jsxs("div", {
                className: "flex justify-center mb-5",
                children: [
                  s === "loading" &&
                    Se.jsx(gp, {
                      className: "w-16 h-16 text-slate-400 animate-pulse",
                    }),
                  s === "ready" &&
                    c === "success" &&
                    Se.jsx(yp, { className: "w-16 h-16 text-cam-500" }),
                  s === "ready" &&
                    c === "expired" &&
                    Se.jsx(kp, { className: "w-16 h-16 text-red-500" }),
                ],
              }),
              Se.jsxs(sp, {
                className: "text-2xl leading-tight",
                children: [
                  s === "loading" && "Đang xác thực...",
                  s === "ready" && c === "success" && "Xác Thực Thành Công!",
                  s === "ready" && c === "expired" && "Đã Hết Hạn",
                ],
              }),
              Se.jsxs(ap, {
                className: "mt-3 text-base leading-relaxed",
                children: [
                  s === "loading" && "Vui lòng chờ trong giây lát",
                  s === "ready" && c === "success" && C,
                  s === "ready" && c === "expired" && C,
                ],
              }),
            ],
          }),
          Se.jsxs(cp, {
            className: "pt-1 space-y-4",
            children: [
              s === "ready" &&
                c === "success" &&
                Se.jsx("div", {
                  className: "pt-2",
                  children: Se.jsx("p", {
                    className: "text-sm text-gray-600 text-center",
                    children:
                      "Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập và bắt đầu sử dụng dịch vụ của chúng tôi.",
                  }),
                }),
              s === "ready" &&
                c === "expired" &&
                Se.jsx("div", {
                  className: "pt-2",
                  children: Se.jsx("p", {
                    className: "text-sm text-gray-600 text-center",
                    children:
                      "Vui lòng kiểm tra email mới nhất của bạn hoặc yêu cầu gửi lại email.",
                  }),
                }),
            ],
          }),
        ],
      }),
    })
  );
}
Cd.createRoot(document.getElementById("root")).render(Se.jsx(xp, {}));

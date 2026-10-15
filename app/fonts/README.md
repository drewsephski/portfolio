# Bundled Inter

`InterVariable.woff2` is the unmodified normal variable font from the official
[Inter repository](https://github.com/rsms/inter), pinned to commit
`353b61b9f4430d5f420d56605a6e7993e0941470` at
`docs/font-files/InterVariable.woff2`. Its SIL Open Font License is included in
`Inter-LICENSE.txt`.

Axon, Convix, and AgentLab load this file with `next/font/local`, preserving their
existing CSS variables and font weights. Their marketplace downloads include this
directory as well.

Bundling Inter avoids the intermittent build failure in Next.js 16.3.3 when
Google Fonts returns an extensionless `/l/font?kit=...&skey=...` URL. The compiler
parses the embedded ampersands as separate query entries and fails with
`next/font/google queries have exactly one entry`. See
[Next.js issue #99114](https://github.com/vercel/next.js/issues/99114) and
[the upstream fix](https://github.com/vercel/next.js/pull/100158), which was not
included in the stable release when this workaround was added.

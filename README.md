# 8-Magic CLI

This repository holds codes of a special API endpoint for terminal tools to fetch, format and show answers to users.

## Usage

Wanna try it? just run this in your terminal:

```bash
curl https://cli.8.alialmasi.ir
```

To use this in older environments or terminals, you might face some problems with the ANSI color codes. For that use the `/?noColor=1` query at the end of the URL.

To receive the raw data fetched from the API, use `/?json=1` query.

> Tip: pipe the raw data to [`jq`](https://github.com/jqlang/jq) for better formatting.

## See Also

- [8-Magic npx](https://github.com/8-Magic/8-magic-npx)
- [8-Magic API](https://api.8.alialmasi.ir)

## License

This project, as part of the work of the 8-Magic team, is licensed under the 8-Magic Public License.  
For more information, [see this page](https://8-magic.github.io/8-Magic-Public-License/).

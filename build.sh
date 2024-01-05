rm -rf dist

pnpm build a --base /a/ --dist /a/

pnpm build b --base /b/ --dist /b/

pnpm build "c/*" --base /c/

pnpm build "d/d1/*" "d/d2/*" --base /d/

pnpm build d/d3 --base /d/d3/ --dist d/d3
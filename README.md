# bookshelf
rebuild the bookshelf app using vue3 and typescript
Built with Vue3, XState, element-UI, vue-query, jest, testing-library and TypeScript

书籍管理应用，支持书籍添加、删除，评分、记笔记、搜索、阅读进度管理、用户注册、登录和退出 
使用Vue作为视图层，Xstate处理逻辑，vue-query对API CRUD操作并缓存结果；Xstate做基于模型的测试有83%代码覆盖率，用TypeScript语言编写

## [demo](https://bookshelf.pages.dev)

## Get Started
1. `git clone https://github.com/lilaw/bookshelf.git`
1. `cd bookshelf`
1. `yarn install`
1. `yarn serve`
1. Open http://localhost:8000 in your browser

### note of react query
`TData` data type return from sever

`TError` value type from promise reject

`TVariables` variable of mutation functiono

`TContext` value return from onMutate







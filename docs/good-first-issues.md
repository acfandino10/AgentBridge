# Good first issues

Open these on GitHub after the repository is public and label them `good first issue`.

1. **Streaming chunks.** `mockProvider.stream` currently yields one chunk. Split the mock text into word chunks and add a test.
2. **Anthropic-shaped provider.** Add a second provider that implements `AIProvider` and reads `ANTHROPIC_API_KEY`, with tests that never call the network.
3. **CLI scaffolds that write files.** `generate feature <name>` prints a stub. Write a real `src/features/<name>.ts` template and a test that uses a temp directory.
4. **ISR cache persistence.** Add an optional file-backed cache next to `InMemoryIsrCache` without changing the in-memory default.
5. **Docs sample for a route.** Add an example that registers two features on `AppRuntime` and prints the render mode for each path.

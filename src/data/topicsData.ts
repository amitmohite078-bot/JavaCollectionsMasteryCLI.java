import { TopicContent, TopicId } from '../types/collections';

export const TOPICS_DATA: Record<TopicId, TopicContent> = {
  ArrayList: {
    id: 1,
    key: 'ArrayList',
    title: 'ArrayList',
    category: 'List',
    badge: 'Contiguous Object[]',
    complexity: 'O(1) Read | O(n) Shift',
    mindMap: `Iterable -> Collection -> List -> ArrayList
  |-- Backing Storage : Object[] elementData (Contiguous Memory)
  |-- Growth Factor   : newCapacity = oldCapacity + (oldCapacity >> 1) [1.5x]
  |-- Performance     : Access: O(1) | Append: Amortized O(1) | Shift Insert/Delete: O(n)
  +-- Memory Locality : Superior (L1/L2 Spatial Cache Locality)`,
    architecture: {
      definition: 'A resizable dynamic array implementation of the List interface maintaining indexed insertion order and continuous memory layout.',
      coreArchitecture: 'Backed by a contiguous Object[] elementData buffer. Default initial capacity is 10. Resizing formula: newCapacity = oldCapacity + (oldCapacity >> 1) [1.5x expansion]. ModCount tracks structural modifications for fail-fast iterators.',
      basicSyntax: `// Declaration and initialization
List<String> list = new ArrayList<>(16); // Pre-sized buffer avoids early resize
list.add("Microservice-A");
list.add(1, "Ingest-Gateway"); // Vectorized shift via System.arraycopy
String item = list.get(0); // O(1) direct pointer offset Base + (0 * 4)
list.remove(0); // Elements shifted left, trailing slot nullified for GC`,
      keyPoints: [
        'Implements RandomAccess marker interface guaranteeing O(1) direct index lookups via Base + (index * ref_size).',
        'Preserves element insertion order, permits duplicate values, and permits null elements.',
        'Contiguous memory layout maximizes CPU L1/L2 cache prefetching efficiency.',
        'Unsynchronized by default; wrap with Collections.synchronizedList() or use CopyOnWriteArrayList for thread safety.',
        'Resizing occurs when size reaches elementData.length, allocating a new 1.5x array and copying via Arrays.copyOf.'
      ],
      advantages: [
        'Blazing fast O(1) constant time random positional reads via memory offset calculation.',
        'Extremely low memory footprint per element (only 4 bytes pointer in CompressedOOPs 64-bit JVMs).',
        'Superior spatial memory locality yielding high CPU cache line hit ratios during sequential iteration.'
      ],
      disadvantages: [
        'Costly O(n) middle insertions/deletions due to vectorized element memory shifts with System.arraycopy.',
        'Resizing incurs latency spikes and temporary memory duplication when growing large backing arrays.',
        'Unused allocated capacity headroom can waste heap memory if not trimmed via trimToSize().'
      ]
    },
    operations: [
      {
        name: 'Equality & Identity Comparison',
        category: 'Compare',
        signature: 'public boolean equals(Object o)',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        syntax: `List<String> list1 = new ArrayList<>(List.of("A", "B", "C"));
List<String> list2 = new ArrayList<>(List.of("A", "B", "C"));

// Structural equality check
boolean isEqual = list1.equals(list2); // returns true

// Element-wise comparison using equals()
boolean contains = list1.contains("B"); // invokes "B".equals(elementData[i])`,
        internalWorking: 'Iterates both lists synchronously. First performs reference identity check (this == o). Verifies (o instanceof List<?>). Compares sizes. Iterates element-by-element using (e1 == null ? e2 == null : e1.equals(e2)). Returns false immediately on the first mismatched element.',
        mechanics: [
          'Direct reference equality check: if (o == this) return true;',
          'Type check: if (!(o instanceof List)) return false;',
          'Synchronous ListIterator traversal comparing elementData[i].equals(other[i])',
          'Returns true only if both lists contain identical elements in identical sequence order'
        ],
        pitfalls: [
          'Comparing ArrayList with LinkedList: equals() returns true if elements and order match, but performance is O(n) due to LinkedList pointer chasing.',
          'Custom elements must properly override both equals() and hashCode() to avoid incorrect comparison results.'
        ]
      },
      {
        name: 'Append & Positional Insert',
        category: 'Insertion',
        signature: 'public boolean add(E e) / public void add(int index, E element)',
        timeComplexity: 'Amortized O(1) for add(e); O(n) for add(index, e)',
        spaceComplexity: 'O(1) aux; O(n) on 1.5x resize',
        syntax: `List<String> list = new ArrayList<>(10);
list.add("Tail-Item"); // Amortized O(1) append
list.add(0, "Head-Item"); // O(n) positional insert - shifts elements right`,
        internalWorking: 'Appending assigns elementData[size++] = element. If size reaches elementData.length, invokes grow() which allocates a 1.5x array (newCapacity = oldCapacity + (oldCapacity >> 1)) and copies items via Arrays.copyOf. Positional insertion executes rangeCheckForAdd(index), ensures capacity, and invokes native System.arraycopy to shift (size - index) elements right by 1 index slot before assigning elementData[index] = element.',
        mechanics: [
          'Checks capacity: if (size == elementData.length) elementData = grow();',
          'Positional insert executes System.arraycopy(elementData, index, elementData, index + 1, size - index);',
          'Assigns element: elementData[index] = element;',
          'Increments size and modCount'
        ],
        pitfalls: [
          'Adding elements at index 0 repeatedly causes O(n^2) total latency due to continuous array shifts.',
          'Under-sizing initial capacity leads to multiple intermediate resizing copies during bulk ingest.'
        ]
      },
      {
        name: 'Positional & Value Deletion',
        category: 'Deletion',
        signature: 'public E remove(int index) / public boolean remove(Object o)',
        timeComplexity: 'O(n) average/worst; O(1) for last element',
        spaceComplexity: 'O(1)',
        syntax: `String removed = list.remove(2); // Remove by index (returns old value)
boolean deleted = list.remove("Tail-Item"); // Remove by value equals()
list.removeIf(s -> s.startsWith("Temp")); // Batch bulk remove`,
        internalWorking: 'remove(index) validates range check, captures oldValue = elementData[index], calculates numMoved = size - index - 1, and invokes System.arraycopy(elementData, index + 1, elementData, index, numMoved) to shift elements left. Crucially, explicitly executes elementData[--size] = null to prevent memory loitering and assist Garbage Collection.',
        mechanics: [
          'Validates bounds: rangeCheck(index);',
          'Computes shift count: int numMoved = size - index - 1;',
          'Vectorized left shift: System.arraycopy(elementData, index + 1, elementData, index, numMoved);',
          'Nullifies trailing slot: elementData[--size] = null;'
        ],
        pitfalls: [
          'Calling list.remove(1) on a List<Integer> calls remove(int index) rather than remove(Object o). Use list.remove(Integer.valueOf(1)) to remove by value.',
          'Mutating list during for-each iteration throws ConcurrentModificationException. Use Iterator.remove() or removeIf().'
        ]
      },
      {
        name: 'Direct Indexed & Linear Search',
        category: 'Searching',
        signature: 'public E get(int index) / public int indexOf(Object o)',
        timeComplexity: 'O(1) for get(index); O(n) for indexOf(o) / contains(o)',
        spaceComplexity: 'O(1)',
        syntax: `String item = list.get(3); // O(1) instant memory offset
int firstIdx = list.indexOf("Target"); // O(n) linear scan
boolean exists = list.contains("Target"); // delegates to indexOf(o) >= 0`,
        internalWorking: 'get(index) executes rangeCheck(index) and directly computes memory address: address = baseAddress + (index * reference_size), returning (E) elementData[index] in a single CPU instruction. indexOf(o) loops from 0 to size - 1 comparing null or o.equals(elementData[i]). If the list is sorted, Collections.binarySearch(list, key) achieves O(log n).',
        mechanics: [
          'Executes rangeCheck(index);',
          'Direct array pointer offset: (E) elementData[index];',
          'Linear scan handles null elements safely: if (o == null) { ... } else { ... }'
        ],
        pitfalls: [
          'Assuming contains() is fast: contains() is O(n) linear scan. For O(1) membership checks, use HashSet.'
        ]
      },
      {
        name: 'In-Place Dual-Pivot Timsort',
        category: 'Sorting',
        signature: 'public void sort(Comparator<? super E> c)',
        timeComplexity: 'O(n log n) worst/avg; O(n) best-case (pre-sorted)',
        spaceComplexity: 'O(n) temporary buffer',
        syntax: `// Natural ordering sort
list.sort(Comparator.naturalOrder());

// Custom chained comparator
list.sort(Comparator.comparing(User::getAge).thenComparing(User::getName));`,
        internalWorking: 'Delegates to Arrays.sort(elementData, 0, size, c) which runs Adaptive Dual-Pivot Timsort (hybrid Merge/Insertion sort). Finds natural pre-sorted ascending/descending runs. Sorts small chunks (< 32 elements) using Binary Insertion Sort and merges balanced runs with stack tracking to guarantee O(n log n) stability.',
        mechanics: [
          'Identifies contiguous monotonic runs in elementData',
          'Sorts short runs using Binary Insertion Sort',
          'Merges adjacent balanced runs using stack with O(n log n) worst-case stability',
          'Increments modCount'
        ],
        pitfalls: [
          'Comparator must fulfill mathematical transitivity contracts; violating transitivity throws IllegalArgumentException: Comparison method violates its general contract!'
        ]
      }
    ],
    scenarios: [
      { id: 1, domain: 'E-Commerce Product Catalog', problem: 'Fast indexed pagination and display of 50,000 inventory items under heavy read traffic.', solution: 'ArrayList provides O(1) random indexed reads (get(i)) with zero pointer overhead, maximizing CPU cache prefetching.' },
      { id: 2, domain: 'Financial Order History Log', problem: 'Sequential high-throughput ingestion of append-only completed trade execution tickets.', solution: 'Pre-sized ArrayList(100000) achieves O(1) amortized appends with zero resizing spikes during market open surges.' },
      { id: 3, domain: 'Real-Time Flight Telemetry', problem: 'Storing and processing fixed-size batches of GPS coordinates received every 100ms.', solution: 'ArrayList provides minimal per-element memory overhead (4 bytes CompressedOOP) compared to node structures.' },
      { id: 4, domain: 'Gaming Leaderboard Display', problem: 'Rendering the top 100 players from an already-sorted tournament bracket.', solution: 'Direct subList(0, 100) on ArrayList creates a lightweight random-access view without allocating new arrays.' },
      { id: 5, domain: 'Microservice Request Batcher', problem: 'Aggregating incoming async HTTP payloads before flushing in bulk to Kafka.', solution: 'ArrayList efficiently accumulates items and converts to array in-place via toArray() with zero iteration overhead.' },
      { id: 6, domain: 'Database Query Resultset Mapper', problem: 'Hydrating JDBC row records into Java DTO entities with known row count.', solution: 'Constructing new ArrayList<>(rowCount) guarantees exact memory allocation without costly resize copies.' },
      { id: 7, domain: 'Machine Learning Feature Vectors', problem: 'Iterating through millions of numeric weights during vector dot-product computations.', solution: 'Contiguous memory layout ensures sequential cache line loading, outperforming linked nodes by 15x.' },
      { id: 8, domain: 'Compiler Lexer Token Buffer', problem: 'Storing parsed lexical tokens for backtracking during recursive descent AST parsing.', solution: 'ArrayList supports random positional lookahead and backtrack index jumps in O(1) time.' },
      { id: 9, domain: 'Distributed Cache Read Buffer', problem: 'Deserializing binary protobuf payload chunks into an in-memory memory segment.', solution: 'ArrayList back-buffer matches memory block layouts, minimizing GC allocation pressure.' },
      { id: 10, domain: 'Stock Market Ticker Buffer', problem: 'High-frequency price tick recording where older items are periodically trimmed in batch.', solution: 'Pre-allocated ArrayList combined with clear() reuses backing buffers without re-instantiation.' },
      { id: 11, domain: 'IoT Sensor Metrics Aggregator', problem: 'Holding hourly humidity readings from 10,000 edge gateways.', solution: 'ArrayList memory density allows keeping millions of records in heap without triggering GC thrashing.' },
      { id: 12, domain: 'Shopping Cart Item List', problem: 'Managing a customer cart containing 5-20 items with frequent item inspections.', solution: 'Compact ArrayList footprint is ideal for small collections stored inside user session state.' },
      { id: 13, domain: 'PDF Document Page Indexer', problem: 'Jumping directly to arbitrary page metadata tables during PDF rendering.', solution: 'ArrayList guarantees O(1) random access by page number without traversing intermediate pages.' },
      { id: 14, domain: 'Audio Sample Signal Processing', problem: 'Processing 44.1kHz audio sample frames with high sequential iteration throughput.', solution: 'Dense array memory layout allows SIMD vectorization optimizations by HotSpot JIT compiler.' },
      { id: 15, domain: 'Autocomplete Search Suggestions', problem: 'Returning top 10 pre-computed prefix search results to frontend UI.', solution: 'ArrayList returns indexed results instantly with minimal serialization overhead.' },
      { id: 16, domain: 'Video Streaming Chunk Manifest', problem: 'Looking up video segment URLs by segment index (e.g. segment #450) during playback.', solution: 'ArrayList provides O(1) direct index retrieval of the exact media chunk URI.' },
      { id: 17, domain: 'Graph Node Adjacency List', problem: 'Representing out-edges for sparse graph nodes in pathfinding algorithms.', solution: 'ArrayList provides compact storage for neighboring vertex IDs with minimal per-edge overhead.' },
      { id: 18, domain: 'Audit Event Replay Engine', problem: 'Replaying chronologically recorded system security events in order.', solution: 'ArrayList preserves exact insertion sequence and supports fast forward/reverse ListIterator.' },
      { id: 19, domain: 'Batch Invoicing System', problem: 'Exporting 200,000 billing records to CSV format sequentially.', solution: 'Sequential enhanced for-loop iteration on ArrayList compiles to raw memory pointer increments.' },
      { id: 20, domain: 'Static Configuration Registry', problem: 'Loading immutable feature flags once at startup for high-read evaluation.', solution: 'ArrayList wrapped in Collections.unmodifiableList() offers thread-safe lock-free O(1) reads.' }
    ],
    interviewQAs: [
      { id: 1, category: 'Service-Based', question: 'What is the default initial capacity of an ArrayList in Java 8+?', answer: 'In Java 8+, creating new ArrayList<>() initializes elementData with an empty array constant (DEFAULTCAPACITY_EMPTY_ELEMENTDATA). The default capacity of 10 is only allocated upon adding the very first element, conserving memory for empty lists.' },
      { id: 2, category: 'Service-Based', question: 'How does ArrayList grow when its backing capacity is exceeded?', answer: 'When size reaches capacity, grow() calculates newCapacity = oldCapacity + (oldCapacity >> 1), which is a 50% increase (1.5x). It then allocates a new array of that size and copies elements using Arrays.copyOf.' },
      { id: 3, category: 'Service-Based', question: 'Why is ArrayList not thread-safe, and what exception is thrown on concurrent modification?', answer: 'ArrayList methods are unsynchronized to maximize single-threaded throughput. If one thread structurally modifies the list while another iterates, the iterator detects a mismatch between its expectedModCount and modCount, throwing ConcurrentModificationException.' },
      { id: 4, category: 'Service-Based', question: 'What is the time complexity of adding an element at index 0 vs appending at the end?', answer: 'Adding at index 0 is O(n) because all n existing elements must be shifted one position to the right using System.arraycopy. Appending at the end is amortized O(1) because elements are placed directly at elementData[size++] without shifting.' },
      { id: 5, category: 'Service-Based', question: 'What is the difference between ArrayList and Vector?', answer: 'Vector is a legacy class from Java 1.0 where every method is synchronized, incurring lock overhead. Vector grows by 100% (2x) by default, while ArrayList is unsynchronized and grows by 50% (1.5x).' },
      { id: 6, category: 'Service-Based', question: 'How do you make an ArrayList thread-safe?', answer: 'You can wrap it with Collections.synchronizedList(new ArrayList<>()), use CopyOnWriteArrayList for read-heavy workloads, or manage access with explicit ReentrantLock/synchronized blocks.' },
      { id: 7, category: 'Service-Based', question: 'What is the purpose of the RandomAccess interface implemented by ArrayList?', answer: 'RandomAccess is a marker interface (no methods) signaling that the collection supports fast, constant-time O(1) random access. Algorithms like Collections.binarySearch check instanceof RandomAccess to choose indexed loops over iterator traversal.' },
      { id: 8, category: 'Service-Based', question: 'What happens to the backing array when remove(int index) is called?', answer: 'The element at index is removed by shifting elements from index + 1 to size - 1 left by one position with System.arraycopy. Crucially, elementData[size - 1] is assigned null to prevent loitering object references and enable Garbage Collection.' },
      { id: 9, category: 'Service-Based', question: 'What does trimToSize() do in ArrayList?', answer: 'trimToSize() trims the capacity of the backing Object[] array to the exact current size of the list, freeing unused allocated capacity headroom.' },
      { id: 10, category: 'Service-Based', question: 'How do you convert an Array to an ArrayList and vice versa?', answer: 'Array to ArrayList: Arrays.asList(arr) or new ArrayList<>(List.of(arr)). ArrayList to Array: list.toArray(new String[0]), which is type-safe and JIT-optimized.' },
      { id: 11, category: 'Product-Based', question: 'Prove why the amortized time complexity of ArrayList.add() is O(1) despite resizing copies.', answer: 'Using the Aggregate / Accounting method: Suppose we double or 1.5x capacity. To insert N elements starting from capacity 1, resizes happen at 1, 2, 4, 8... 2^k <= N. Total elements copied = 1 + 2 + 4 + ... + N = 2N - 1. Total cost for N inserts = N (regular writes) + (2N - 1) (copy operations) = 3N - 1. Amortized cost per operation = (3N - 1) / N <= 3 = O(1).' },
      { id: 12, category: 'Product-Based', question: 'How does ArrayList take advantage of CPU L1/L2 cache lines and spatial locality?', answer: 'CPU cores fetch memory in 64-byte cache lines. Because ArrayList elements are contiguous reference pointers in memory, a single 64-byte cache line loads 8 to 16 consecutive references at once. In sequential traversal, subsequent reads hit L1 cache (1-2ns) with near-zero cache misses, unlike LinkedList which chases scattered heap pointers (50-100ns latency).' },
      { id: 13, category: 'Product-Based', question: 'What is the internal memory layout and byte overhead of an ArrayList in 64-bit JVM with CompressedOOPs?', answer: 'An ArrayList object header is 12 bytes (8-byte Mark Word + 4-byte Klass Word) + 4-byte size int + 4-byte elementData reference + 4-byte modCount int + 4-byte padding = 32 bytes on heap. The backing Object[] array header is 16 bytes + (capacity * 4 bytes per pointer). Total overhead is minimal compared to node-based structures.' },
      { id: 14, category: 'Product-Based', question: 'What is "memory loitering" and how does OpenJDK ArrayList prevent it during deletion?', answer: 'Memory loitering occurs when an unused object reference remains stored in an array slot, preventing the JVM Garbage Collector from reclaiming the object. In ArrayList.remove(), after shifting elements left, the implementation explicitly executes elementData[--size] = null to clear the dangling reference.' },
      { id: 15, category: 'Product-Based', question: 'Explain how Spliterator in ArrayList enables parallel divide-and-conquer in Java Streams.', answer: 'ArrayList.ArrayListSpliterator implements trySplit() by splitting its index range: int mid = (origin + fence) >>> 1. Because array boundaries are contiguous, trySplit() splits instantly in O(1) time without traversing elements, providing perfectly balanced sub-tasks for ForkJoinPool worker threads.' },
      { id: 16, category: 'Product-Based', question: 'Why does ArrayList avoid shifting elements when elements are removed via subList().clear()?', answer: 'subList() returns a SubList view pointing to the same parent backing array. When subList.clear() is called, it calculates the batch range and calls parent.removeRange(offset, offset + size), performing a single vectorized System.arraycopy shift for the entire batch rather than multiple shifts.' },
      { id: 17, category: 'Product-Based', question: 'What are the risks of ArrayList when passing a very large initial capacity like new ArrayList<>(Integer.MAX_VALUE - 8)?', answer: 'Allocating massive contiguous arrays requires a contiguous block of free JVM heap space. If sufficient contiguous space is unavailable, the JVM throws OutOfMemoryError: Java heap space or Requested array size exceeds VM limit (due to array header 8-byte reserve).' },
      { id: 18, category: 'Product-Based', question: 'How does fail-fast mechanism work using modCount and expectedModCount?', answer: 'Every structural mutation (add, remove, clear, sort) increments the integer field modCount++. When an Iterator is created, it caches expectedModCount = modCount. On every next() or remove() invocation, it checks if (modCount != expectedModCount); if true, it immediately throws ConcurrentModificationException before reading corrupted state.' },
      { id: 19, category: 'Product-Based', question: 'Why does System.arraycopy use native C/assembly rather than a Java for-loop?', answer: 'System.arraycopy is a JVM intrinsic mapped directly to vectorized CPU instructions (such as memmove or AVX-512 VMOVDQU), allowing the CPU to copy 32 to 64 bytes per cycle and handle overlapping source/dest ranges without extra temporary buffers.' },
      { id: 20, category: 'Product-Based', question: 'How would you design an off-heap cache-friendly replacement for ArrayList for low-latency HFT?', answer: 'Allocate off-heap memory using java.lang.foreign.MemorySegment or Unsafe. Use flat primitive memory layouts without object boxing, fixed-size structs, 64-byte cache line padding to prevent false sharing, and power-of-two circular ring buffers.' }
    ],
    quizzes: [
      { id: 1, difficulty: 'Easy', question: 'What is the default initial capacity allocated to an ArrayList when the first element is added in Java 8+?', options: ['A) 0', 'B) 10', 'C) 16', 'D) 32'], correctOption: 'B', explanation: 'In Java 8+, new ArrayList<>() starts with an empty array and expands to default capacity of 10 upon adding the first element.' },
      { id: 2, difficulty: 'Easy', question: 'What is the growth formula used by ArrayList during capacity expansion in OpenJDK?', options: ['A) capacity * 2', 'B) capacity + (capacity >> 1)', 'C) capacity + 10', 'D) capacity * 1.75'], correctOption: 'B', explanation: 'ArrayList grows by 50% using bit-shift arithmetic: newCapacity = oldCapacity + (oldCapacity >> 1).' },
      { id: 3, difficulty: 'Easy', question: 'Which marker interface does ArrayList implement to signify constant-time index access?', options: ['A) SequentialAccess', 'B) RandomAccess', 'C) Indexable', 'D) DirectAccess'], correctOption: 'B', explanation: 'RandomAccess is a marker interface signaling O(1) indexed access capability.' },
      { id: 4, difficulty: 'Easy', question: 'What is the time complexity of list.get(index) in ArrayList?', options: ['A) O(1)', 'B) O(log n)', 'C) O(n)', 'D) O(n log n)'], correctOption: 'A', explanation: 'ArrayList computes memory address directly as Base + (index * 4 bytes), executing in O(1) constant time.' },
      { id: 5, difficulty: 'Easy', question: 'What exception is thrown when an ArrayList is modified structurally during an active for-each loop?', options: ['A) IndexOutOfBoundsException', 'B) ConcurrentModificationException', 'C) IllegalStateException', 'D) ArrayStoreException'], correctOption: 'B', explanation: 'Fail-fast iterators compare modCount with expectedModCount and throw ConcurrentModificationException.' },
      { id: 6, difficulty: 'Easy', question: 'Can an ArrayList store duplicate elements and null values?', options: ['A) Neither duplicates nor nulls', 'B) Only unique elements, permits null', 'C) Permits both duplicates and nulls', 'D) Only duplicates, rejects nulls'], correctOption: 'C', explanation: 'ArrayList allows duplicate elements and multiple null values.' },
      { id: 7, difficulty: 'Easy', question: 'Which method should be called to minimize unused allocated capacity in an ArrayList?', options: ['A) compact()', 'B) trimToSize()', 'C) shrink()', 'D) fit()'], correctOption: 'B', explanation: 'trimToSize() reallocates the backing array to match exact current size.' },
      { id: 8, difficulty: 'Medium', question: 'What is the time complexity of list.add(0, "Item") on an ArrayList with n elements?', options: ['A) O(1)', 'B) O(log n)', 'C) O(n)', 'D) O(n^2)'], correctOption: 'C', explanation: 'Inserting at index 0 requires shifting all n existing elements right by one slot using System.arraycopy.' },
      { id: 9, difficulty: 'Medium', question: 'What happens to elementData[size - 1] when remove(int index) executes in OpenJDK?', options: ['A) It is deleted from memory automatically', 'B) It is set to null to avoid memory loitering', 'C) It is left unchanged until overwritten', 'D) It is assigned a sentinel 0 value'], correctOption: 'B', explanation: 'The trailing slot is explicitly set to null so the Garbage Collector can reclaim the unlinked object.' },
      { id: 10, difficulty: 'Medium', question: 'What algorithm is used by ArrayList.sort() in OpenJDK?', options: ['A) Quicksort', 'B) Dual-Pivot Timsort', 'C) Heapsort', 'D) Bubble Sort'], correctOption: 'B', explanation: 'ArrayList delegates to Arrays.sort() which runs Adaptive Timsort, a stable hybrid Merge/Insertion sort.' },
      { id: 11, difficulty: 'Medium', question: 'If an ArrayList currently has capacity 10 and becomes full, what will its new capacity be upon the 11th add()?', options: ['A) 15', 'B) 16', 'C) 20', 'D) 12'], correctOption: 'A', explanation: '10 + (10 >> 1) = 10 + 5 = 15.' },
      { id: 12, difficulty: 'Medium', question: 'What happens if you remove elements from an ArrayList using list.remove(obj) inside an enhanced for-loop?', options: ['A) Works seamlessly', 'B) Throws ConcurrentModificationException', 'C) Drops the last element', 'D) Skips subsequent iterations silently'], correctOption: 'B', explanation: 'Direct list mutation modifies modCount while the iterator loop checks expectedModCount, triggering CME.' },
      { id: 13, difficulty: 'Medium', question: 'How does Collections.synchronizedList(list) achieve thread safety?', options: ['A) Lock-free CAS', 'B) Synchronizing on a mutex object around every method call', 'C) Copying on every write', 'D) ThreadLocal isolation'], correctOption: 'B', explanation: 'SynchronizedCollection wraps each method in synchronized(mutex) { ... }.' },
      { id: 14, difficulty: 'Medium', question: 'What is the return value of ArrayList.remove(int index) vs ArrayList.remove(Object o)?', options: ['A) Both return boolean', 'B) Both return the removed element', 'C) remove(index) returns the removed element; remove(Object) returns boolean', 'D) remove(index) returns boolean; remove(Object) returns int'], correctOption: 'C', explanation: 'remove(int) returns E (the removed element); remove(Object) returns boolean (true if found and removed).' },
      { id: 15, difficulty: 'Hard', question: 'Why does ArrayList spliterator split in exact O(1) time unlike LinkedList spliterator?', options: ['A) Because it holds array bounds (index range) and splits as (origin + fence) >>> 1', 'B) Because it uses lock-free pointers', 'C) Because it skips null checks', 'D) Because it clones the entire array'], correctOption: 'A', explanation: 'ArrayListSpliterator knows continuous index boundaries, allowing instant mathematical midpoint splitting.' },
      { id: 16, difficulty: 'Hard', question: 'What is the maximum capacity an ArrayList can allocate in standard HotSpot 64-bit JVM?', options: ['A) Integer.MAX_VALUE (2,147,483,647)', 'B) Integer.MAX_VALUE - 8 (2,147,483,639)', 'C) 1,000,000,000', 'D) Long.MAX_VALUE'], correctOption: 'B', explanation: 'MAX_ARRAY_SIZE is Integer.MAX_VALUE - 8 to reserve header space required by VM memory management.' },
      { id: 17, difficulty: 'Hard', question: 'In terms of CPU hardware architecture, why is iterating over an ArrayList 10x-20x faster than a LinkedList?', options: ['A) ArrayList uses primitive bytes', 'B) ArrayList exhibits high spatial cache locality, loading contiguous references into L1/L2 cache lines', 'C) LinkedList has thread synchronization overhead', 'D) LinkedList requires JNI native calls'], correctOption: 'B', explanation: 'Contiguous arrays leverage hardware cache line prefetching, avoiding expensive DRAM memory stalls.' },
      { id: 18, difficulty: 'Hard', question: 'What is the difference between ArrayList.ensureCapacity(minCapacity) and new ArrayList<>(initialCapacity)?', options: ['A) No difference', 'B) ensureCapacity explicitly increases capacity of an existing instance; constructor sets initial capacity at instantiation', 'C) ensureCapacity fills with nulls', 'D) Constructor triggers GC'], correctOption: 'B', explanation: 'ensureCapacity is called on an existing list before bulk additions to prevent multiple intermediate resizes.' },
      { id: 19, difficulty: 'Hard', question: 'What happens when subList(1, 4).clear() is called on an ArrayList?', options: ['A) It allocates a new list', 'B) It delegates to parent.removeRange(1, 4), shifting elements left in a single System.arraycopy batch', 'C) It throws UnsupportedOperationException', 'D) It leaves empty null gaps'], correctOption: 'B', explanation: 'SubList operations modify the backing parent array directly in a single batch shift.' },
      { id: 20, difficulty: 'Hard', question: 'Why is CopyOnWriteArrayList preferred over Collections.synchronizedList for 99% read / 1% write workloads?', options: ['A) Reads are completely lock-free and never block or throw ConcurrentModificationException', 'B) It uses less memory', 'C) It allows duplicate keys', 'D) It stores elements off-heap'], correctOption: 'A', explanation: 'CopyOnWriteArrayList provides lock-free volatile array reads; writes clone the array, giving snapshot isolation.' }
    ]
  },

  LinkedList: {
    id: 2,
    key: 'LinkedList',
    title: 'LinkedList',
    category: 'List',
    badge: 'Doubly-Linked Nodes',
    complexity: 'O(1) Endpoints | O(n) Traversal',
    mindMap: `Iterable -> Collection -> List / Deque / Queue -> LinkedList
  |-- Backing Storage : Doubly-Linked Node<E> (item, next, prev)
  |-- Endpoints       : Direct first and last references
  |-- Performance     : Endpoints: O(1) | Mid Traversals: O(n)
  +-- Overheads       : 24-32 bytes per node + GC allocation pressure`,
    architecture: {
      definition: 'A doubly-linked node sequence implementing List, Deque, and Queue interfaces supporting efficient constant-time insertions and removals at both ends.',
      coreArchitecture: 'Maintains independent heap-allocated Node<E> objects with item payload, next pointer, and prev pointer. Retains first (Head) and last (Tail) pointers. Traversal searches start from first or last depending on which is closer to the target index.',
      basicSyntax: `// Using as a Double-Ended Queue (Deque)
Deque<String> deque = new LinkedList<>();
deque.addFirst("Job-Head"); // O(1) linkFirst pointer rewire
deque.addLast("Job-Tail");  // O(1) linkLast pointer rewire
String head = deque.removeFirst(); // O(1) unlinkFirst
String mid = ((List<String>) deque).get(5); // O(n) pointer traversal!`,
      keyPoints: [
        'Implements both List and Deque interfaces, functioning as a FIFO Queue, LIFO Stack, or Double-Ended Queue.',
        'No contiguous array allocation or capacity limits; nodes are allocated on-demand dynamically on the heap.',
        'Endpoint additions and deletions (addFirst, addLast, removeFirst, removeLast) run in strict O(1) time.',
        'Positional indexed access requires bidirectional pointer chasing up to n/2 nodes.',
        'High per-node memory overhead (24 bytes in CompressedOOPs) plus generational GC allocation overhead.'
      ],
      advantages: [
        'Guaranteed constant O(1) time insertion and deletion at both extremities without memory shifting.',
        'Smooth dynamic growth without memory-resizing spikes or unused pre-allocated capacity headroom.',
        'Direct node pointer unlinking executes in O(1) when a Node/ListIterator reference is already held.'
      ],
      disadvantages: [
        'Substantial memory overhead (24-32 bytes per node on 64-bit JVMs for node wrappers).',
        'Poor CPU cache line hit ratio caused by scattered heap pointers causing cache misses.',
        'O(n) random access; cannot leverage RandomAccess index calculations.'
      ]
    },
    operations: [
      {
        name: 'Node Equality & Contains',
        category: 'Compare',
        signature: 'public boolean contains(Object o) / public boolean equals(Object o)',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        syntax: `LinkedList<String> list = new LinkedList<>(List.of("A", "B", "C"));
boolean hasItem = list.contains("B"); // O(n) pointer traversal
boolean areEqual = list.equals(anotherList); // compares node by node`,
        internalWorking: 'indexOf(o) executes linear pointer traversal starting from first node (Node<E> x = first; x != null; x = x.next). Checks if (o == null ? x.item == null : o.equals(x.item)). Returns index if found; returns -1 if exhausted.',
        mechanics: [
          'Initializes pointer cursor at head: Node<E> x = first;',
          'Iterates through chain dereferencing x = x.next;',
          'Compares each node payload via equals();',
          'Returns true if match found, false upon reaching null'
        ],
        pitfalls: [
          'Calling contains() repeatedly inside a loop yields O(n^2) runtime. Prefer HashSet for constant-time membership lookups.'
        ]
      },
      {
        name: 'Endpoint & Positional Insertion',
        category: 'Insertion',
        signature: 'public void addFirst(E e) / public void addLast(E e) / public void add(int index, E element)',
        timeComplexity: 'O(1) at endpoints; O(n) at middle index',
        spaceComplexity: '24B per Node',
        syntax: `Deque<String> deque = new LinkedList<>();
deque.addFirst("Head"); // O(1) linkFirst pointer rewire
deque.addLast("Tail");   // O(1) linkLast pointer rewire
((List<String>) deque).add(2, "Middle"); // O(n) traversal + O(1) linkBefore`,
        internalWorking: 'linkFirst(e) captures Node<E> f = first, instantiates new Node<>(null, e, f), sets first = newNode. If f was null, last = newNode; else f.prev = newNode. Positional add traverses n/2 nodes to locate successor, then executes linkBefore(e, node).',
        mechanics: [
          'Allocates Node<E>(prev, item, next) on heap;',
          'Rewires adjacent endpoint pointers in O(1);',
          'Increments size and modCount;'
        ],
        pitfalls: [
          'High memory allocation pressure: adding 1,000,000 items allocates 1,000,000 separate Node instances, triggering severe GC Eden space churn.'
        ]
      },
      {
        name: 'Endpoint & Node Unlinking',
        category: 'Deletion',
        signature: 'public E removeFirst() / public E removeLast() / public E remove(int index)',
        timeComplexity: 'O(1) at endpoints; O(n) for positional index',
        spaceComplexity: 'O(1)',
        syntax: `String head = deque.removeFirst(); // O(1) unlinkFirst
String tail = deque.removeLast();  // O(1) unlinkLast
boolean rem = deque.remove("Target"); // O(n) search + O(1) unlink`,
        internalWorking: 'unlinkFirst(f) captures Node<E> next = f.next, nullifies f.item and f.next, and updates first = next. If next is null, last = null; else next.prev = null. Splicing out middle node x sets x.prev.next = x.next and x.next.prev = x.prev in O(1).',
        mechanics: [
          'Captures adjacent pointer references;',
          'Nullifies internal item, next, and prev references for GC;',
          'Updates first/last endpoint references if boundary node is detached;'
        ],
        pitfalls: [
          'removeFirst() throws NoSuchElementException on empty list. Use pollFirst() to safely return null.'
        ]
      },
      {
        name: 'Bidirectional Endpoint & Index Search',
        category: 'Searching',
        signature: 'public E getFirst() / public E getLast() / public E get(int index)',
        timeComplexity: 'O(1) at endpoints; O(n) for get(index)',
        spaceComplexity: 'O(1)',
        syntax: `String head = deque.getFirst(); // O(1) direct head pointer
String tail = deque.getLast();  // O(1) direct tail pointer
String mid = ((List<String>) deque).get(5); // O(n) pointer chasing!`,
        internalWorking: 'getFirst() and getLast() return first.item and last.item directly in O(1). get(index) calls node(index), which checks if (index < (size >> 1)). If true, traverses forward from first; otherwise backward from last, dereferencing up to n/2 pointers.',
        mechanics: [
          'Checks bounds 0 <= index < size;',
          'Selects closest endpoint based on index < (size >> 1);',
          'Traverses pointer chain dereferencing x = x.next or x = x.prev;'
        ],
        pitfalls: [
          'Using a standard indexed for-loop (for(int i=0; i<list.size(); i++) list.get(i)) on a LinkedList is catastrophic O(n^2). Always use an enhanced for-loop or Iterator!'
        ]
      },
      {
        name: 'Array Dump & Timsort',
        category: 'Sorting',
        signature: 'public void sort(Comparator<? super E> c)',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n) auxiliary Object[]',
        syntax: `LinkedList<String> list = new LinkedList<>(List.of("Charlie", "Alice", "Bob"));
list.sort(Comparator.naturalOrder()); // Dumps to array, sorts with Timsort, rewrites nodes`,
        internalWorking: 'LinkedList does not sort in-place over pointer links. It dumps node payloads into a contiguous Object[] array via toArray(), sorts the array via Arrays.sort(Timsort), and writes the sorted items back into existing nodes using a ListIterator.',
        mechanics: [
          'Allocates Object[size] array and populates it from node items;',
          'Invokes Arrays.sort(array, comparator) running Dual-Pivot Timsort;',
          'Traverses nodes with ListIterator writing sorted values back;'
        ],
        pitfalls: [
          'Sorting a LinkedList allocates a full duplicate array buffer on the heap; if memory is tight, prefer sorting on an ArrayList directly.'
        ]
      }
    ],
    scenarios: [
      { id: 1, domain: 'FIFO Asynchronous Task Queue', problem: 'Producer threads add jobs at tail; worker threads consume from head with zero resize overhead.', solution: 'LinkedList acts as a lightweight Deque/Queue with true O(1) addLast and removeFirst.' },
      { id: 2, domain: 'Browser Navigation History', problem: 'Forward and Back button navigation where pages are pushed/popped at endpoints.', solution: 'Doubly-linked nodes permit seamless bidirectional stepping and endpoint node truncation.' },
      { id: 3, domain: 'Undo/Redo Command Manager', problem: 'Tracking user edit actions in an IDE with constant-time truncation of undone states.', solution: 'Unlinking the current node automatically drops all trailing redo branches in O(1).' },
      { id: 4, domain: 'Sliding Window Rate Limiter', problem: 'Tracking request timestamps in a 60-second window, constantly evicting expired head entries.', solution: 'LinkedList efficiently purges expired timestamps from head while appending new requests at tail.' },
      { id: 5, domain: 'Music Player Playlist Queue', problem: 'Playing songs sequentially, jumping to next/previous track, and inserting songs into Up Next.', solution: 'Doubly-linked next and prev pointers allow smooth bidirectional track skipping.' },
      { id: 6, domain: 'Real-Time Chat Message Buffer', problem: 'Maintaining the latest 50 chat messages, dropping oldest when new message arrives.', solution: 'O(1) addLast() combined with O(1) removeFirst() maintains fixed-length scrolling log.' },
      { id: 7, domain: 'Round-Robin CPU Scheduler', problem: 'Rotating active thread execution slices in circular sequence.', solution: 'LinkedList facilitates moving the current head task to tail in O(1) without reallocations.' },
      { id: 8, domain: 'Breadth-First Search (BFS) Frontier', problem: 'Queueing graph vertex nodes to explore during shortest path graph traversal.', solution: 'Deque queue operations offer clean enqueue (offer) and dequeue (poll) semantics.' },
      { id: 9, domain: 'Log Pipeline Staging Buffer', problem: 'Buffering log lines before flushing to disk during peak server load bursts.', solution: 'On-demand node allocation avoids reserving large blocks of contiguous memory upfront.' },
      { id: 10, domain: 'Print Spooler Job Dispatcher', problem: 'Managing print jobs submitted by multiple network printers in order.', solution: 'LinkedList guarantees strict FIFO order dispatching without array copy delays.' },
      { id: 11, domain: 'LRU Cache Eviction Chain', problem: 'Promoting accessed nodes to head and evicting cold nodes from tail.', solution: 'Doubly-linked pointer unlinking enables true O(1) mid-list node detachment.' },
      { id: 12, domain: 'Call Center Agent Queue', problem: 'Routing incoming caller tickets to the first available support representative.', solution: 'O(1) queue polling ensures instant dispatching under high call concurrency.' },
      { id: 13, domain: 'Text Editor Cursor Movement', problem: 'Inserting and deleting characters at cursor position in an open document buffer.', solution: 'ListIterator.add() and remove() execute in O(1) at the current cursor position.' },
      { id: 14, domain: 'Financial Order Cancellation', problem: 'Cancelling an existing pending order by direct reference in an active order list.', solution: 'Holding a Node reference allows O(1) unlinking without scanning the entire list.' },
      { id: 15, domain: 'IoT Event Dispatcher', problem: 'Dispatching sensor alert notifications to registered consumer listeners.', solution: 'Sequential iteration across active listeners without pre-allocating large capacity.' },
      { id: 16, domain: 'Elevator Floor Request Dispatcher', problem: 'Servicing floor stops in bidirectional sequence (ascending then descending).', solution: 'Bidirectional ListIterator navigates smoothly between elevator stops.' },
      { id: 17, domain: 'Packet Reassembly Buffer', problem: 'Stitching out-of-order network frames at both head and tail boundaries.', solution: 'addFirst and addLast handle dynamic boundary frame placement.' },
      { id: 18, domain: 'Card Game Discard Pile', problem: 'Drawing from top of deck and placing discarded cards onto the discard pile.', solution: 'LIFO Stack methods (push, pop, peek) execute at top of list in O(1).' },
      { id: 19, domain: 'Compiler Symbol Scope Stack', problem: 'Pushing local variable scopes on function entry and popping on function exit.', solution: 'LinkedList implements Deque as a fast, clean scope stack.' },
      { id: 20, domain: 'Assembly Line Station Tracker', problem: 'Tracking items advancing sequentially across manufacturing assembly stages.', solution: 'Nodes advance through pipeline stages with zero array element shifting.' }
    ],
    interviewQAs: [
      { id: 1, category: 'Service-Based', question: 'What is the internal node structure of a LinkedList in Java?', answer: 'LinkedList uses a static nested class Node<E> containing three fields: E item (payload reference), Node<E> next (pointer to successor), and Node<E> prev (pointer to predecessor).' },
      { id: 2, category: 'Service-Based', question: 'Why does LinkedList implement the Deque interface?', answer: 'Implementing Deque allows LinkedList to function as a Double-Ended Queue, FIFO Queue, or LIFO Stack with methods like offerFirst, offerLast, pollFirst, pollLast, peekFirst, and peekLast.' },
      { id: 3, category: 'Service-Based', question: 'How does LinkedList optimize the get(int index) operation?', answer: 'It checks whether the index is in the first half or second half of the list (index < size >> 1). If in the first half, it starts traversal from first; if in the second half, it starts from last, traversing at most n/2 nodes.' },
      { id: 4, category: 'Service-Based', question: 'What is the time complexity of inserting an element in the middle of a LinkedList?', answer: 'It is O(n) overall because finding the middle node requires traversing n/2 pointers (O(n)), followed by the pointer rewiring (O(1)). However, if you already hold a ListIterator at that position, insertion is O(1).' },
      { id: 5, category: 'Service-Based', question: 'Why should you prefer ArrayDeque over LinkedList for Queue/Stack operations?', answer: 'ArrayDeque is backed by a circular resizable array with zero node allocation overhead, superior CPU cache locality, and lower memory footprint, outperforming LinkedList for queues and stacks.' },
      { id: 6, category: 'Service-Based', question: 'Does LinkedList support the RandomAccess interface?', answer: 'No. LinkedList does not implement RandomAccess because random indexed reads require O(n) pointer traversal rather than O(1) memory offset calculation.' },
      { id: 7, category: 'Service-Based', question: 'What happens during LinkedList.clear() in OpenJDK?', answer: 'It iterates through all nodes, explicitly setting node.item = null, node.next = null, and node.prev = null, and sets first = last = null. This breaks cyclic references and aids generational Garbage Collection.' },
      { id: 8, category: 'Service-Based', question: 'Can a LinkedList contain null elements?', answer: 'Yes. LinkedList permits null elements as valid node payloads (Node.item can be null).' },
      { id: 9, category: 'Service-Based', question: 'What is the difference between poll() and remove() in LinkedList?', answer: 'Both retrieve and remove the head element. However, remove() throws NoSuchElementException if the list is empty, while poll() returns null safely.' },
      { id: 10, category: 'Service-Based', question: 'How does LinkedList sort its elements when list.sort() is called?', answer: 'It copies all node items to an Object[] array via toArray(), sorts the array with Arrays.sort(Timsort), and writes the sorted items back into the existing nodes using a ListIterator.' },
      { id: 11, category: 'Product-Based', question: 'Calculate the exact memory footprint of 1,000,000 integers in ArrayList vs LinkedList on a 64-bit JVM with CompressedOOPs.', answer: 'ArrayList: 1M Integer references (4MB) + Integer objects (16MB) + ArrayList object (32B) ≈ 20MB. LinkedList: 1M Node objects (each has 12B header + 3x4B references = 24B, so 24MB) + 1M Integer objects (16MB) + LinkedList object (32B) ≈ 40MB. LinkedList consumes 2x more memory and creates 1M extra Node objects on heap.' },
      { id: 12, category: 'Product-Based', question: 'Explain the CPU cache miss penalty during LinkedList iteration compared to ArrayList.', answer: 'ArrayList nodes are contiguous in RAM; reading elementData[i] prefetches elements i+1 through i+15 into L1 cache (1-2 CPU cycles). LinkedList nodes are allocated at scattered virtual memory heap addresses; each node dereference causes a cache miss requiring a full DRAM round-trip (~100 CPU cycles), making iteration up to 20x slower.' },
      { id: 13, category: 'Product-Based', question: 'How does ListIterator.remove() achieve O(1) removal while List.remove(int) is O(n)?', answer: 'List.remove(int) must first traverse up to n/2 pointers to find the node. ListIterator already maintains a direct reference to the last returned node (lastReturned), so remove() simply unlinks that specific node in O(1) time without traversal.' },
      { id: 14, category: 'Product-Based', question: 'Why does LinkedList.clear() traverse every node nullifying pointers instead of just setting first = last = null?', answer: 'If only first and last are nullified, old-generation nodes pointing to young-generation nodes via next/prev pointers can cause young-generation GC cycles (Card Table scanning) to keep the entire chain alive, delaying garbage collection.' },
      { id: 15, category: 'Product-Based', question: 'How does the Spliterator in LinkedList handle trySplit() compared to ArrayList?', answer: 'LinkedListSpliterator cannot split by index arithmetic. It uses a batching approach: it traverses forward by a batch size (starting at 1024, doubling up to 33,554,432), copies references into a temporary array, and returns an ArraySpliterator over that batch, incurring traversal and allocation costs.' },
      { id: 16, category: 'Product-Based', question: 'What is the risk of using LinkedList in high-throughput low-latency microservices?', answer: 'Creating and destroying millions of Node instances per second causes massive allocation churn in the JVM Eden space, triggering frequent Minor GC pauses and degrading sub-millisecond p99 latency SLAs.' },
      { id: 17, category: 'Product-Based', question: 'Explain how unlinking a node in a doubly-linked list restores structural invariants.', answer: 'For node x: x.prev.next is set to x.next, and x.next.prev is set to x.prev. Boundary edge cases (x == first or x == last) update the respective endpoint pointers directly.' },
      { id: 18, category: 'Product-Based', question: 'Why is ConcurrentLinkedDeque preferred over Collections.synchronizedList(new LinkedList())?', answer: 'ConcurrentLinkedDeque uses non-blocking lock-free algorithms based on Michael & Scott dual-link CAS (Compare-And-Swap) pointers, allowing concurrent producers and consumers to push/poll without acquiring exclusive locks.' },
      { id: 19, category: 'Product-Based', question: 'What happens if you use a LinkedList as a stack vs an ArrayDeque in terms of JIT escape analysis?', answer: 'ArrayDeque elements can be stack-allocated or scalar-replaced by the JIT compiler if they do not escape the method. LinkedList Node allocations almost always escape to heap, preventing scalar replacement optimizations.' },
      { id: 20, category: 'Product-Based', question: 'How would you implement a memory-efficient unrolled linked list in Java?', answer: 'An unrolled linked list stores small fixed-size arrays (e.g. 16 elements) inside each node. This reduces pointer overhead by 16x and improves CPU cache locality while retaining O(1) node insertion.' }
    ],
    quizzes: [
      { id: 1, difficulty: 'Easy', question: 'What data structure is used internally by Java LinkedList?', options: ['A) Single-linked list', 'B) Doubly-linked list', 'C) Dynamic array', 'D) Circular buffer'], correctOption: 'B', explanation: 'LinkedList is implemented as a doubly-linked list with prev and next pointers.' },
      { id: 2, difficulty: 'Easy', question: 'What is the time complexity of adding an element at the beginning of a LinkedList (addFirst)?', options: ['A) O(1)', 'B) O(log n)', 'C) O(n)', 'D) O(n log n)'], correctOption: 'A', explanation: 'addFirst creates a new node and updates the head pointer in O(1) constant time.' },
      { id: 3, difficulty: 'Easy', question: 'Which of the following interfaces is NOT implemented by LinkedList?', options: ['A) List', 'B) Deque', 'C) Queue', 'D) RandomAccess'], correctOption: 'D', explanation: 'LinkedList does NOT implement RandomAccess because random indexed reads take O(n).' },
      { id: 4, difficulty: 'Easy', question: 'What is the time complexity of list.get(index) in a LinkedList with n elements?', options: ['A) O(1)', 'B) O(log n)', 'C) O(n)', 'D) O(1) amortized'], correctOption: 'C', explanation: 'get(index) must traverse pointers from head or tail to the target index in O(n) time.' },
      { id: 5, difficulty: 'Easy', question: 'What does deque.peekFirst() return on an empty LinkedList?', options: ['A) Throws NoSuchElementException', 'B) Returns null', 'C) Returns false', 'D) Throws NullPointerException'], correctOption: 'B', explanation: 'peekFirst() returns null safely on an empty list, whereas getFirst() throws an exception.' },
      { id: 6, difficulty: 'Easy', question: 'Can a Java LinkedList contain duplicate items and nulls?', options: ['A) Neither', 'B) Duplicates only', 'C) Nulls only', 'D) Both duplicates and nulls'], correctOption: 'D', explanation: 'LinkedList allows duplicates and multiple null elements.' },
      { id: 7, difficulty: 'Easy', question: 'Which method should be used to remove and return the head of a queue safely?', options: ['A) poll()', 'B) remove()', 'C) pop()', 'D) delete()'], correctOption: 'A', explanation: 'poll() retrieves and removes head, returning null if empty without throwing an exception.' },
      { id: 8, difficulty: 'Medium', question: 'How does LinkedList optimize the get(index) search when index > size / 2?', options: ['A) Binary search', 'B) Traverses backward starting from last (Tail)', 'C) Hash lookup', 'D) Skips to index via offset'], correctOption: 'B', explanation: 'It checks if index >= (size >> 1) and traverses backward starting from last.' },
      { id: 9, difficulty: 'Medium', question: 'Why does ArrayDeque generally outperform LinkedList for Queue implementations?', options: ['A) ArrayDeque is thread-safe', 'B) ArrayDeque uses a contiguous circular array with zero node allocation and superior cache locality', 'C) ArrayDeque allows sorting', 'D) ArrayDeque uses less CPU cores'], correctOption: 'B', explanation: 'ArrayDeque has zero node wrapper allocations and contiguous memory cache friendliness.' },
      { id: 10, difficulty: 'Medium', question: 'How much memory overhead does each LinkedList node create on a 64-bit JVM with CompressedOOPs?', options: ['A) 4 bytes', 'B) 8 bytes', 'C) 24 bytes', 'D) 64 bytes'], correctOption: 'C', explanation: '12 bytes object header + 3 x 4 bytes compressed references (item, next, prev) = 24 bytes.' },
      { id: 11, difficulty: 'Medium', question: 'What is the time complexity of ListIterator.add("Item") when the iterator is at the current position?', options: ['A) O(1)', 'B) O(log n)', 'C) O(n)', 'D) O(size/2)'], correctOption: 'A', explanation: 'When the iterator already holds the node reference, linkBefore() rewires pointers in O(1) time.' },
      { id: 12, difficulty: 'Medium', question: 'What is the behavior of LinkedList.remove(5) vs LinkedList.remove(Integer.valueOf(5))?', options: ['A) Both remove element at index 5', 'B) Both remove element with value 5', 'C) remove(5) removes index 5; remove(Integer.valueOf(5)) removes value 5', 'D) Both throw compile errors'], correctOption: 'C', explanation: 'Primitive int calls remove(int index); Object wrapper calls remove(Object o).' },
      { id: 13, difficulty: 'Medium', question: 'How does LinkedList.sort() work under the hood in Java 8+?', options: ['A) Mergesort directly on node pointers', 'B) Converts nodes to an Object[] array, sorts via Arrays.sort, and writes values back', 'C) Quicksort on pointers', 'D) Bubble sort on nodes'], correctOption: 'B', explanation: 'It dumps nodes into an array, sorts with Timsort, and rewrites values using ListIterator.' },
      { id: 14, difficulty: 'Medium', question: 'What happens if you call list.getFirst() on an empty LinkedList?', options: ['A) Returns null', 'B) Throws NoSuchElementException', 'C) Throws IndexOutOfBoundsException', 'D) Throws NullPointerException'], correctOption: 'B', explanation: 'getFirst() throws NoSuchElementException if the list is empty.' },
      { id: 15, difficulty: 'Hard', question: 'Why does LinkedList.clear() set every node item, next, and prev to null instead of just first = last = null?', options: ['A) Java compiler requirement', 'B) To prevent cross-generational GC card table retention where old-gen references keep young-gen nodes alive', 'C) To prevent JVM segmentation faults', 'D) It is an obsolete legacy optimization'], correctOption: 'B', explanation: 'Explicit nullification breaks reference chains, preventing GC retention across memory generations.' },
      { id: 16, difficulty: 'Hard', question: 'How does LinkedList Spliterator split elements during parallel stream execution?', options: ['A) Splits by exact index math (O(1))', 'B) Traverses forward by batch size, copies references to an array, and returns an ArraySpliterator', 'C) Splits at head and tail concurrently', 'D) Does not support parallel streams'], correctOption: 'B', explanation: 'LinkedListSpliterator must traverse pointers in chunks (batch size), creating array-backed spliterators.' },
      { id: 17, difficulty: 'Hard', question: 'What is the main drawback of LinkedList in modern CPU microarchitectures?', options: ['A) Dynamic dispatch', 'B) Cache line misses and pointer chasing stalling CPU pipelines', 'C) Thread contention', 'D) High stack memory usage'], correctOption: 'B', explanation: 'Pointer chasing across scattered heap addresses causes constant CPU cache misses and pipeline stalls.' },
      { id: 18, difficulty: 'Hard', question: 'What is the time complexity of deque.removeLastOccurrence(Object o)?', options: ['A) O(1)', 'B) O(log n)', 'C) O(n) traversing backward from tail', 'D) O(n^2)'], correctOption: 'C', explanation: 'It starts at last and traverses backward via prev pointers until it finds the match.' },
      { id: 19, difficulty: 'Hard', question: 'Which collection provides the functionality of LinkedList but with lock-free thread safety?', options: ['A) Collections.synchronizedList', 'B) ConcurrentLinkedDeque', 'C) CopyOnWriteArraySet', 'D) Vector'], correctOption: 'B', explanation: 'ConcurrentLinkedDeque uses non-blocking CAS pointer rewiring.' },
      { id: 20, difficulty: 'Hard', question: 'If you need O(1) inserts/deletes at both ends and O(1) indexed reads, what collection should you choose?', options: ['A) LinkedList', 'B) ArrayList', 'C) ArrayDeque', 'D) None in standard java.util satisfies both natively; a custom circular array list is required'], correctOption: 'D', explanation: 'ArrayList has O(n) head inserts; LinkedList has O(n) reads; ArrayDeque lacks indexed get(i).' }
    ]
  },

  HashSet: {
    id: 3,
    key: 'HashSet',
    title: 'HashSet',
    category: 'Set',
    badge: 'HashMap-Backed Unique Set',
    complexity: 'O(1) Avg Add / Lookup',
    mindMap: `Iterable -> Collection -> Set -> HashSet
  |-- Backing Storage : HashMap<E, Object> (Key = Element, Value = PRESENT)
  |-- Bucketing       : index = (capacity - 1) & (hash ^ (hash >>> 16))
  |-- Performance     : Add / Contains / Remove: O(1) Average
  +-- Collision Action: Separate Chaining -> Treeification at 8 collisions`,
    architecture: {
      definition: 'An unordered, unique-element collection backed internally by an instance of HashMap where elements are stored as map keys.',
      coreArchitecture: 'Backed by private transient HashMap<E, Object> map. Values are associated with a dummy Object constant (PRESENT). Computes bucket index via bitmask (n - 1) & hash where hash = (h = key.hashCode()) ^ (h >>> 16). Collisions are resolved via separate chaining, converting to Red-Black tree when bin size >= 8.',
      basicSyntax: `// Initializing with known capacity and load factor
Set<String> set = new HashSet<>(32, 0.75f);
boolean added1 = set.add("AUTH_TOKEN"); // Returns true (put == null)
boolean added2 = set.add("AUTH_TOKEN"); // Returns false (duplicate rejected)
boolean exists = set.contains("AUTH_TOKEN"); // O(1) average lookup`,
      keyPoints: [
        'Guarantees element uniqueness based on key.hashCode() and key.equals() contracts.',
        'Provides O(1) average time complexity for add, contains, and remove operations.',
        'Permits a single null element entry (mapped to bucket index 0 with hash 0).',
        'Provides no ordering guarantees; iteration order can shift across table resizing passes.',
        'Requires proper implementation of both hashCode() and equals() to prevent duplicate insertion bugs.'
      ],
      advantages: [
        'Blazing fast O(1) constant time performance for duplicate detection and membership checks.',
        'Automatic duplicate rejection without manual conditional inspection.',
        'Seamless integration with mathematical set operations (addAll = union, retainAll = intersection, removeAll = difference).'
      ],
      disadvantages: [
        'Iteration performance depends on total capacity plus size O(capacity + size).',
        'Degrades to O(log n) or O(n) under pathological hash collisions or improper hashCode().',
        'Higher memory consumption per element than primitive arrays due to HashMap.Node instances.'
      ]
    },
    operations: [
      {
        name: 'HashCode Contract & Key Equality',
        category: 'Compare',
        signature: 'public boolean equals(Object o) / public int hashCode()',
        timeComplexity: 'O(1) Avg; O(log n) worst collision',
        spaceComplexity: 'O(1)',
        syntax: `// Object contract for custom element
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Session)) return false;
    Session session = (Session) o;
    return Objects.equals(sessionId, session.sessionId);
}

@Override
public int hashCode() {
    return Objects.hash(sessionId);
}`,
        internalWorking: 'When checking duplicate or comparing entries, HashSet computes hash = (h = key.hashCode()) ^ (h >>> 16). Bucket index i = (capacity - 1) & hash. Traverses nodes in bucket verifying: if (p.hash == hash && ((k = p.key) == key || key.equals(k))). Only if both hash equality AND equals() return true are elements treated as duplicates.',
        mechanics: [
          'Computes 32-bit integer hashCode() on key object;',
          'Applies bit-spread high-to-low XOR mixer;',
          'Executes identity check (p.key == key) optimizing reference match;',
          'Falls back to equals() if references differ but hashes match;'
        ],
        pitfalls: [
          'Overriding equals() without overriding hashCode() violates the general contract and causes duplicate elements to be inserted into different buckets!'
        ]
      },
      {
        name: 'Deduplicated Insert (add)',
        category: 'Insertion',
        signature: 'public boolean add(E e)',
        timeComplexity: 'O(1) average; O(log n) worst-case collision',
        spaceComplexity: '32B (HashMap.Node)',
        syntax: `Set<String> set = new HashSet<>();
boolean firstAdd = set.add("API_KEY"); // returns true
boolean duplicate = set.add("API_KEY"); // returns false (rejected)`,
        internalWorking: 'Delegates to map.put(e, PRESENT) == null. Hashes key and places it in table bucket (n - 1) & hash. If bucket is empty, instantiates new Node<>(hash, key, PRESENT, null). If populated, traverses bin; if key already exists, returns old value (PRESENT != null), so add() returns false without modification. If unique, appends at tail and returns true.',
        mechanics: [
          'Computes 16-bit spread hash: (h = key.hashCode()) ^ (h >>> 16);',
          'Calculates bucket index: (table.length - 1) & hash;',
          'Traverses bin checking hash and equals();',
          'Appends Node and treeifies bin if count >= 8 and capacity >= 64;'
        ],
        pitfalls: [
          'Mutating an element after insertion changes its hashCode, leaving the element trapped in the wrong bucket and unreachable by subsequent operations.'
        ]
      },
      {
        name: 'Bucket Unlinking & Deletion (remove)',
        category: 'Deletion',
        signature: 'public boolean remove(Object o)',
        timeComplexity: 'O(1) average; O(log n) worst-case',
        spaceComplexity: 'O(1)',
        syntax: `boolean deleted = set.remove("API_KEY"); // Returns true if found
set.removeIf(token -> token.isExpired()); // Bulk predicate removal`,
        internalWorking: 'Delegates to map.remove(o) == PRESENT. Hashes object, locates bucket table[(n - 1) & hash], locates matching Node via equals(), and splices the node out of the bucket chain (prev.next = node.next) or calls removeTreeNode() if bucket is a Red-Black tree. Reverts tree to linked list (untreeify) if bin size drops to 6.',
        mechanics: [
          'Locates target bucket via hash bitmasking;',
          'Traverses bin matching hash and equals();',
          'Unlinks node from linked list or rebalances Red-Black tree;',
          'Decrements size and returns true;'
        ],
        pitfalls: [
          'Concurrent removal during iterator scan throws ConcurrentModificationException. Use Iterator.remove() or Set.removeIf().'
        ]
      },
      {
        name: 'O(1) Average Membership Lookup (contains)',
        category: 'Searching',
        signature: 'public boolean contains(Object o)',
        timeComplexity: 'O(1) average; O(log n) worst-case',
        spaceComplexity: 'O(1)',
        syntax: `boolean isWhitelisted = set.contains("AUTH_TOKEN"); // Instant O(1) check
if (set.containsAll(requiredRoles)) { /* Bulk subset check */ }`,
        internalWorking: 'Delegates to map.containsKey(o). Hashes key, locates bucket table[(n - 1) & hash], and checks first node in bucket directly (first.hash == hash && (first.key == key || key.equals(first.key))). If first node does not match, queries TreeNode.find() or traverses next pointer chain.',
        mechanics: [
          'Computes hash and locates table index in single CPU cycle;',
          'Optimized root check satisfies ~90% of lookups immediately;',
          'Iterates only across colliding bucket nodes;'
        ],
        pitfalls: [
          'Pathological hash collisions (all keys producing same bucket index) degrade contains() to O(log n) in Java 8+ and O(n) in legacy Java 7.'
        ]
      },
      {
        name: 'External Array / TreeSet Export (sort)',
        category: 'Sorting',
        signature: 'Collections.sort(new ArrayList<>(set)) / new TreeSet<>(set)',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n) auxiliary collection',
        syntax: `// Sort via ArrayList dump
List<String> sortedList = new ArrayList<>(hashSet);
Collections.sort(sortedList);

// Sort via TreeSet conversion
TreeSet<String> sortedSet = new TreeSet<>(hashSet);

// Stream sorting
List<String> streamSorted = hashSet.stream().sorted().toList();`,
        internalWorking: 'HashSet does not support native sorting because elements are distributed across hash table bucket bins. To sort, elements are extracted via iterator, loaded into an ArrayList or TreeSet, and sorted via Timsort or Red-Black tree insertion.',
        mechanics: [
          'Scans all non-empty table buckets O(capacity + size);',
          'Dumps elements into continuous array buffer;',
          'Sorts elements using Dual-Pivot Timsort in O(n log n);'
        ],
        pitfalls: [
          'Iterating over a sparse HashSet with capacity 1,000,000 and only 10 elements takes O(1,000,010) because all bucket slots must be scanned.'
        ]
      }
    ],
    scenarios: [
      { id: 1, domain: 'API Authentication Token Whitelist', problem: 'Validating incoming JWT token validity against an active revoked-token set in < 1ms.', solution: 'HashSet provides O(1) contains() membership validation without scanning arrays.' },
      { id: 2, domain: 'Web Crawler Visited URL Deduplication', problem: 'Preventing cyclical loop crawl traversals across millions of crawled hyperlinks.', solution: 'HashSet.add(url) returns false immediately if the URL was previously visited, filtering in O(1).' },
      { id: 3, domain: 'Financial Transaction Fraud Detection', problem: 'Checking if a merchant ID belongs to a blacklisted high-risk merchant pool.', solution: 'O(1) lookup allows inspecting thousands of transactions per second with zero latency impact.' },
      { id: 4, domain: 'E-Commerce Product SKU Deduplicator', problem: 'Removing duplicate product IDs from batch catalog feeds uploaded by third-party sellers.', solution: 'Adding all items to a HashSet automatically purges duplicate records.' },
      { id: 5, domain: 'Graph Cycle Detection Algorithm', problem: 'Tracking visited vertex IDs in Depth-First Search (DFS) traversal.', solution: 'HashSet tracks visited node IDs with instant O(1) membership queries.' },
      { id: 6, domain: 'Database Query IN-Clause Optimizer', problem: 'Filtering in-memory records matching a list of target foreign keys.', solution: 'Transforming target list to HashSet converts O(n * m) filter into O(n) scan.' },
      { id: 7, domain: 'User Permission Role Checker', problem: 'Checking if an active user has required permission strings (e.g. "ROLE_ADMIN").', solution: 'HashSet contains() checks authorization strings with zero parsing delay.' },
      { id: 8, domain: 'Spam Keyword Filter', problem: 'Checking if incoming comment strings contain any prohibited spam words.', solution: 'HashSet of banned terms enables instant O(1) keyword detection.' },
      { id: 9, domain: 'Lottery Ticket Number Generator', problem: 'Generating 6 unique random lottery integers between 1 and 49.', solution: 'HashSet ensures exactly 6 non-repeating numbers are collected before finishing.' },
      { id: 10, domain: 'Network Packet De-Duplicator', problem: 'Discarding duplicate UDP packets received over redundant network paths.', solution: 'HashSet tracks recent packet sequence IDs and drops duplicates.' },
      { id: 11, domain: 'Distributed Cache Invalidation Key Set', problem: 'Holding keys that must be purged from CDN edge caches in batch.', solution: 'HashSet avoids storing duplicate purge keys, reducing network RPC payload size.' },
      { id: 12, domain: 'Spell Checker Dictionary', problem: 'Verifying if a typed word exists in an English dictionary of 200,000 words.', solution: 'HashSet provides instant O(1) word validation without tree branch traversal.' },
      { id: 13, domain: 'Social Network Mutual Friends Finder', problem: 'Calculating common friends between two users.', solution: 'setA.retainAll(setB) executes mathematical set intersection in linear time.' },
      { id: 14, domain: 'Email Campaign Recipient Filter', problem: 'Suppressing unsubscribed email addresses from a 1,000,000 recipient newsletter blast.', solution: 'HashSet of unsubscribed emails allows instant suppression filtering.' },
      { id: 15, domain: 'Game Server Active Player Tracker', problem: 'Tracking player IDs currently connected to an MMORPG game world shard.', solution: 'HashSet tracks connected player IDs with O(1) login/logout updates.' },
      { id: 16, domain: 'Compiler Reserved Keyword Table', problem: 'Checking if a source code identifier matches a reserved language keyword (e.g. "class", "void").', solution: 'HashSet matches keywords in O(1) time during lexical scanning.' },
      { id: 17, domain: 'Microservice IP Rate Limit Whitelist', problem: 'Bypassing rate-limiting rules for internal trusted microservice IP addresses.', solution: 'HashSet validates caller IP against trusted CIDR whitelist instantly.' },
      { id: 18, domain: 'Document Vocabulary Analyzer', problem: 'Counting the number of distinct unique words in a large text corpus.', solution: 'HashSet size() returns the exact unique vocabulary count after single-pass ingest.' },
      { id: 19, domain: 'Stock Market Symbol Watchlist', problem: 'Allowing users to pin and unpin stock tickers with instant presence check.', solution: 'HashSet manages unique tickers and rejects duplicate pin actions.' },
      { id: 20, domain: 'Real-Time Inventory Location Check', problem: 'Verifying if a warehouse location bin has open storage capacity.', solution: 'HashSet tracks occupied bin IDs with instant add/remove transitions.' }
    ],
    interviewQAs: [
      { id: 1, category: 'Service-Based', question: 'How is HashSet implemented internally in Java?', answer: 'HashSet is backed internally by an instance of HashMap. When you add an element to a HashSet, it stores the element as a key in the backing HashMap and associates it with a dummy static constant Object value called PRESENT.' },
      { id: 2, category: 'Service-Based', question: 'Why does HashSet require overriding both equals() and hashCode()?', answer: 'HashSet uses hashCode() to determine the bucket index. If two equal objects have different hashCodes, they land in different buckets and both get added (violating uniqueness). If hashCode is identical, equals() must return true to recognize them as duplicates.' },
      { id: 3, category: 'Service-Based', question: 'Can a HashSet contain null elements?', answer: 'Yes. HashSet permits exactly one null element. Null keys are always mapped to bucket index 0 with a hash code of 0.' },
      { id: 4, category: 'Service-Based', question: 'What is the time complexity of add(), remove(), and contains() in HashSet?', answer: 'All three operations run in O(1) average time complexity assuming a well-distributed hash function. In worst-case pathological collision scenarios, complexity degrades to O(log n) in Java 8+ due to Red-Black treeification.' },
      { id: 5, category: 'Service-Based', question: 'What is the difference between HashSet and LinkedHashSet?', answer: 'HashSet provides no ordering guarantees. LinkedHashSet extends HashSet and maintains a doubly-linked list running through all its entries, preserving element insertion order during iteration at a slight memory cost.' },
      { id: 6, category: 'Service-Based', question: 'What is the difference between HashSet and TreeSet?', answer: 'HashSet is backed by a hash table, offers O(1) average lookup, is unordered, and allows null. TreeSet is backed by a Red-Black tree, offers O(log n) lookup, maintains sorted order, and rejects nulls.' },
      { id: 7, category: 'Service-Based', question: 'What is the default initial capacity and load factor of HashSet?', answer: 'Default initial capacity is 16 and default load factor is 0.75 (same as HashMap). Capacity is always a power of two.' },
      { id: 8, category: 'Service-Based', question: 'Is HashSet synchronized or thread-safe?', answer: 'No. HashSet is not thread-safe. Concurrent modifications during iteration cause ConcurrentModificationException. Use Collections.synchronizedSet(new HashSet<>()) or ConcurrentHashMap.newKeySet() for thread safety.' },
      { id: 9, category: 'Service-Based', question: 'What happens when a duplicate element is added to a HashSet?', answer: 'The add(E e) method delegates to map.put(e, PRESENT). Since the key already exists, map.put returns the existing value (PRESENT != null), and add() returns false without modifying the set.' },
      { id: 10, category: 'Service-Based', question: 'How do you perform Union and Intersection using HashSet?', answer: 'Union: setA.addAll(setB). Intersection: setA.retainAll(setB). Difference: setA.removeAll(setB).' },
      { id: 11, category: 'Product-Based', question: 'Explain the 16-bit high-to-low bit-spreading hash function used in OpenJDK: (h = key.hashCode()) ^ (h >>> 16).', answer: 'When table capacity is small (e.g. 16), bucket index (n - 1) & hash only uses the lowest 4 bits of the hash. If keys differ only in high bits, collisions occur. Shifting high bits right by 16 (h >>> 16) and XORing with original h mixes high-order bits into low-order bits, minimizing collisions across small power-of-two tables.' },
      { id: 12, category: 'Product-Based', question: 'Why does HashMap/HashSet constrain table capacity strictly to powers of two (2^n)?', answer: 'Power-of-two capacity allows replacing the slow modulo division operator (hash % n) with an ultra-fast bitwise AND operation: (n - 1) & hash. Bitwise AND executes in a single CPU cycle.' },
      { id: 13, category: 'Product-Based', question: 'What happens to a HashSet if an element object is mutated after being inserted into the set?', answer: 'If an object is mutated such that its hashCode() or equals() result changes, its bucket index shifts. Calling contains() will compute the new hash and check a different bucket, failing to find the element (causing memory leaks and zombie entries).' },
      { id: 14, category: 'Product-Based', question: 'Explain what happens during Treeification of a bucket in HashSet/HashMap in Java 8+.', answer: 'When collisions in a single bucket reach TREEIFY_THRESHOLD (8) AND total table capacity is >= MIN_TREEIFY_CAPACITY (64), the linked list is converted into a Red-Black Tree (TreeNode). This transforms worst-case lookup from O(n) to O(log n), mitigating HashDoS algorithmic complexity attacks.' },
      { id: 15, category: 'Product-Based', question: 'Why is TREEIFY_THRESHOLD set to 8 and UNTREEIFY_THRESHOLD set to 6?', answer: 'Under random hash codes following Poisson distribution (lambda=0.5), probability of a bin reaching 8 collisions is less than 1 in 10,000,000. Setting untreeify to 6 creates a hysteresis gap of 2, preventing constant thrashing between tree and list on successive add/remove operations.' },
      { id: 16, category: 'Product-Based', question: 'How does HashSet iteration time complexity relate to capacity and size: O(capacity + size)?', answer: 'Iterating over a HashSet requires scanning every bucket in the table array to find populated bins, plus traversing nodes within populated bins. Thus, an oversized HashSet with capacity 1,000,000 and size 10 takes O(1,000,010) to iterate.' },
      { id: 17, category: 'Product-Based', question: 'Why does ConcurrentHashMap.newKeySet() exist instead of ConcurrentHashSet in java.util.concurrent?', answer: 'A Set is fundamentally a Map with dummy values. Rather than creating and maintaining a duplicate ConcurrentHashSet class, JDK architects added ConcurrentHashMap.newKeySet(), which returns a Set view backed by ConcurrentHashMap.' },
      { id: 18, category: 'Product-Based', question: 'How does HashSet Spliterator handle trySplit() across non-contiguous buckets?', answer: 'HashSet uses HashMap.KeySpliterator. trySplit() divides the table array indices (index to fence), skipping empty buckets and yielding sub-spliterators for parallel stream processing.' },
      { id: 19, category: 'Product-Based', question: 'What is the memory overhead of a HashSet storing 100,000 Long objects compared to a BitSet or RoaringBitmap?', answer: 'HashSet overhead: HashMap (48B) + table array (1M references = 4MB) + 100k Node objects (3.2MB) + 100k Long objects (2.4MB) ≈ 10MB. A BitSet or RoaringBitmap for dense integers consumes only ~12KB (800x less memory).' },
      { id: 20, category: 'Product-Based', question: 'Explain the difference in contract between equals() and hashCode() and why unequal objects can share the same hash code.', answer: 'The contract specifies: if a.equals(b) is true, a.hashCode() MUST equal b.hashCode(). However, if a.hashCode() == b.hashCode(), a.equals(b) may be true or false (hash collision due to pigeonhole principle mapping infinite inputs to 32-bit integers).' }
    ],
    quizzes: [
      { id: 1, difficulty: 'Easy', question: 'What data structure is used internally to store elements in a HashSet?', options: ['A) ArrayList', 'B) HashMap', 'C) TreeMap', 'D) LinkedList'], correctOption: 'B', explanation: 'HashSet is backed by a HashMap where elements are stored as keys.' },
      { id: 2, difficulty: 'Easy', question: 'What value is associated with keys inside HashSet backing HashMap?', options: ['A) null', 'B) Integer 1', 'C) A dummy constant Object (PRESENT)', 'D) Boolean true'], correctOption: 'C', explanation: 'A private static final Object PRESENT is used as a shared dummy value.' },
      { id: 3, difficulty: 'Easy', question: 'What is the average time complexity of set.contains(element) in a HashSet?', options: ['A) O(1)', 'B) O(log n)', 'C) O(n)', 'D) O(n log n)'], correctOption: 'A', explanation: 'Hash lookup computes bucket index directly, running in O(1) average time.' },
      { id: 4, difficulty: 'Easy', question: 'How many null elements can be stored in a HashSet?', options: ['A) Zero (throws NPE)', 'B) Exactly one', 'C) Unlimited', 'D) Up to 16'], correctOption: 'B', explanation: 'HashSet permits exactly one null element, stored in bucket index 0.' },
      { id: 5, difficulty: 'Easy', question: 'Does HashSet maintain the insertion order of elements?', options: ['A) Yes, always', 'B) No, order is non-deterministic and can shift across resizes', 'C) Sorts in ascending order', 'D) Sorts in descending order'], correctOption: 'B', explanation: 'HashSet provides no ordering guarantees; use LinkedHashSet for insertion order.' },
      { id: 6, difficulty: 'Easy', question: 'What is returned by set.add("Java") if "Java" is already in the set?', options: ['A) true', 'B) false', 'C) Throws DuplicateElementException', 'D) null'], correctOption: 'B', explanation: 'add() returns false if the element was already present in the set.' },
      { id: 7, difficulty: 'Easy', question: 'Which method computes the intersection of two sets in Java?', options: ['A) setA.intersect(setB)', 'B) setA.retainAll(setB)', 'C) setA.keep(setB)', 'D) setA.filter(setB)'], correctOption: 'B', explanation: 'retainAll() retains only elements that are contained in the specified collection.' },
      { id: 8, difficulty: 'Medium', question: 'What formula calculates the bucket index for a given hash in HashSet/HashMap?', options: ['A) hash % capacity', 'B) (capacity - 1) & hash', 'C) hash / capacity', 'D) hash ^ capacity'], correctOption: 'B', explanation: 'Bitmask (capacity - 1) & hash is an ultra-fast bitwise equivalent to modulo for powers of two.' },
      { id: 9, difficulty: 'Medium', question: 'What happens if you mutate an object stored in a HashSet such that its hashCode changes?', options: ['A) The set automatically re-indexes it', 'B) contains() will fail to find it, causing zombie memory leaks', 'C) Throws IllegalStateException', 'D) Removes it from the set'], correctOption: 'B', explanation: 'Mutating hash keys places the object in the wrong bucket, making it unreachable by contains().' },
      { id: 10, difficulty: 'Medium', question: 'What threshold of collisions in a single bucket triggers treeification in Java 8+ (assuming capacity >= 64)?', options: ['A) 4', 'B) 6', 'C) 8', 'D) 16'], correctOption: 'C', explanation: 'TREEIFY_THRESHOLD is 8 collisions in a single bin.' },
      { id: 11, difficulty: 'Medium', question: 'What is the default load factor of a HashSet?', options: ['A) 0.50', 'B) 0.75', 'C) 0.85', 'D) 1.0'], correctOption: 'B', explanation: '0.75 provides an optimal trade-off between space overhead and lookup performance.' },
      { id: 12, difficulty: 'Medium', question: 'Why does HashSet XOR the hash code with its 16-bit right-shifted self: (h ^ (h >>> 16))?', options: ['A) Encryption security', 'B) To mix high-order bits into low-order bits, reducing collisions in small tables', 'C) To prevent negative hashes', 'D) To compute 64-bit checksum'], correctOption: 'B', explanation: 'Bit spreading ensures high bits affect the lower bitmask index in small capacity tables.' },
      { id: 13, difficulty: 'Medium', question: 'What is the iteration time complexity of a HashSet with capacity C and size N?', options: ['A) O(N)', 'B) O(C)', 'C) O(C + N)', 'D) O(C * N)'], correctOption: 'C', explanation: 'Iteration must scan all C buckets plus traverse all N active nodes.' },
      { id: 14, difficulty: 'Medium', question: 'Which collection is an insertion-ordered Set backed by a hash table and linked list?', options: ['A) TreeSet', 'B) LinkedHashSet', 'C) ArraySet', 'D) SortedSet'], correctOption: 'B', explanation: 'LinkedHashSet preserves insertion order via a doubly-linked iteration list.' },
      { id: 15, difficulty: 'Hard', question: 'Why is untreeify threshold set to 6 rather than 8?', options: ['A) Performance bug', 'B) To provide a hysteresis buffer preventing frequent conversions under repeated adds/removes', 'C) Red-Black tree requires 6 nodes minimum', 'D) Garbage collector optimization'], correctOption: 'B', explanation: 'The gap between 8 (treeify) and 6 (untreeify) prevents thrashing between tree and list.' },
      { id: 16, difficulty: 'Hard', question: 'What happens if two unequal objects return the same hashCode() in a HashSet?', options: ['A) One overwrites the other', 'B) They collide in the same bucket and are distinguished using equals()', 'C) Throws HashCollisionException', 'D) Second object is rejected'], correctOption: 'B', explanation: 'Colliding objects share a bucket bin and are resolved via equals() comparison.' },
      { id: 17, difficulty: 'Hard', question: 'How can you create a thread-safe Set backed by ConcurrentHashMap in Java 8+?', options: ['A) new ConcurrentHashSet<>()', 'B) ConcurrentHashMap.newKeySet()', 'C) Collections.concurrentSet()', 'D) new ConcurrentSet<>()'], correctOption: 'B', explanation: 'ConcurrentHashMap.newKeySet() returns a thread-safe Set view.' },
      { id: 18, difficulty: 'Hard', question: 'What is the worst-case time complexity of HashSet.contains() if all N elements have the exact same hashCode and do NOT implement Comparable?', options: ['A) O(1)', 'B) O(log N)', 'C) O(N)', 'D) O(N log N)'], correctOption: 'B', explanation: 'In Java 8+, treeification still uses identityHashCode tie-breakers, guaranteeing O(log N) depth.' },
      { id: 19, difficulty: 'Hard', question: 'What is the mathematical rationale behind setting default load factor to 0.75?', options: ['A) Based on Chebyshev inequality', 'B) Based on Poisson distribution yielding a collision probability of ~0.00000006 at bin size 8', 'C) Random choice by James Gosling', 'D) Standard hardware page size alignment'], correctOption: 'B', explanation: 'Under Poisson distribution with lambda=0.5, bin size 8 has near-zero probability.' },
      { id: 20, difficulty: 'Hard', question: 'Why does HashSet.toArray() allocate a new array instead of returning the backing table array?', options: ['A) Backing table contains Node wrapper instances and dummy PRESENT values, not bare elements', 'B) Backing array is private native memory', 'C) Security constraint', 'D) Java prevents array sharing'], correctOption: 'A', explanation: 'Table entries are Node<K,V> wrappers containing keys, hashes, and dummy values.' }
    ]
  },

  TreeSet: {
    id: 4,
    key: 'TreeSet',
    title: 'TreeSet',
    category: 'Set',
    badge: 'Red-Black BST',
    complexity: 'O(log n) Guaranteed Bound',
    mindMap: `Iterable -> Collection -> Set -> SortedSet -> NavigableSet -> TreeSet
  |-- Backing Storage : TreeMap (Red-Black Self-Balancing Binary Search Tree)
  |-- Invariants      : Black Root, No Two Reds Adjacent, Uniform Black-Height
  |-- Performance     : Add / Remove / Contains: Guaranteed O(log n)
  +-- Navigable Ops   : floor(), ceiling(), lower(), higher(), subSet()`,
    architecture: {
      definition: 'A sorted, NavigableSet implementation backed internally by a Red-Black self-balancing binary search tree (via TreeMap).',
      coreArchitecture: 'Backed by a NavigableMap/TreeMap. Elements are stored as keys ordered by natural ordering (Comparable) or an explicit Comparator. Balances tree depth to at most 2 * log(n + 1) using Red-Black coloring rules, left rotations, right rotations, and color flips.',
      basicSyntax: `// Initializing with natural ordering or custom comparator
NavigableSet<Integer> tree = new TreeSet<>();
tree.add(50);
tree.add(25);
tree.add(75);
int floor = tree.floor(30);   // Returns 25 (greatest <= 30)
int ceiling = tree.ceiling(30); // Returns 50 (least >= 30)
NavigableSet<Integer> range = tree.subSet(20, true, 60, false);`,
      keyPoints: [
        'Guarantees strict O(log n) time boundaries for add, remove, and contains operations.',
        'Provides rich navigable inspection operations: floor, ceiling, lower, higher, and subSet range views.',
        'Does not permit null elements in Java 7+ (throws NullPointerException upon compare).',
        'Evaluates equality strictly through compareTo() or compare() == 0, ignoring equals().',
        'Maintains elements in sorted order continuously as mutations occur.'
      ],
      advantages: [
        'Elements remain continuously sorted without external sorting passes.',
        'Extremely fast logarithmic boundary, range, and nearest-neighbor search queries.',
        'Deterministic performance immune to pathological hash collision degradation.'
      ],
      disadvantages: [
        'Slower than HashSet for single-key lookups and insertions (O(log n) vs O(1)).',
        'Requires all stored elements to implement Comparable or requires a custom Comparator.',
        'Higher memory overhead per node due to 4 references (parent, left, right, key) plus color boolean.'
      ]
    },
    operations: [
      {
        name: 'Comparable vs Comparator Contract',
        category: 'Compare',
        signature: 'int compareTo(T o) / int compare(T o1, T o2)',
        timeComplexity: 'O(1) per comparison',
        spaceComplexity: 'O(1)',
        syntax: `// Natural Ordering via Comparable
public class StockOrder implements Comparable<StockOrder> {
    private double price;
    @Override
    public int compareTo(StockOrder o) {
        return Double.compare(this.price, o.price);
    }
}

// Custom Ordering via Comparator lambda
NavigableSet<StockOrder> bids = new TreeSet<>(
    Comparator.comparingDouble(StockOrder::getPrice).reversed()
);`,
        internalWorking: 'TreeSet compares elements exclusively using compareTo() or comparator.compare(k1, k2). If compare == 0, keys are treated as identical duplicates and the second insertion is rejected, regardless of what equals() returns! Ignores hashCode() and equals() completely.',
        mechanics: [
          'Invokes cpr.compare(key, t.key) at each branch node;',
          'Branches left if compare < 0;',
          'Branches right if compare > 0;',
          'Treats key as duplicate if compare == 0;'
        ],
        pitfalls: [
          'If compareTo() is inconsistent with equals() (e.g. compareTo returns 0 while equals() returns false), TreeSet violates the general Set contract by dropping unique elements.'
        ]
      },
      {
        name: 'BST Insert & Red-Black Balancing',
        category: 'Insertion',
        signature: 'public boolean add(E e)',
        timeComplexity: 'Guaranteed O(log n)',
        spaceComplexity: '40B per TreeMap.Entry',
        syntax: `NavigableSet<Integer> tree = new TreeSet<>();
tree.add(50); // Root node (BLACK)
tree.add(25); // Inserted as RED, left child
tree.add(75); // Inserted as RED, right child`,
        internalWorking: 'Descends binary search tree from root comparing keys via compare(). Attaches new Entry<>(key, PRESENT, parent) as RED node at leaf. Invokes fixAfterInsertion(e) which executes color flips and at most 2 structural pointer rotations (Left-Rotate / Right-Rotate) to restore Red-Black invariants.',
        mechanics: [
          'Binary search descent: left if < 0, right if > 0;',
          'Attaches Entry<K,V>(key, PRESENT, parent) as RED leaf;',
          'Restores Red-Black invariants in at most 2 rotations via fixAfterInsertion();',
          'Enforces root node to be BLACK;'
        ],
        pitfalls: [
          'Adding null in Java 7+ throws NullPointerException immediately upon attempting compareTo() on null.'
        ]
      },
      {
        name: 'Node Splicing & Balance Deletion',
        category: 'Deletion',
        signature: 'public boolean remove(Object o) / public E pollFirst() / public E pollLast()',
        timeComplexity: 'Guaranteed O(log n)',
        spaceComplexity: 'O(1)',
        syntax: `boolean removed = tree.remove(50); // O(log n) delete & rebalance
Integer lowest = tree.pollFirst();  // O(log n) retrieve & delete min
Integer highest = tree.pollLast();  // O(log n) retrieve & delete max`,
        internalWorking: 'Locates node via binary search in O(log n). If node has two children, replaces key with in-order successor (successor(p)) and unlinks the successor node. If the removed node was BLACK, calls fixAfterDeletion() executing at most 3 pointer rotations and color flips to preserve uniform black-height.',
        mechanics: [
          'Locates target node in O(log n);',
          'If two children exist, swaps with successor(p);',
          'Unlinks node with at most 1 child;',
          'Restores black-height balance in at most 3 rotations via fixAfterDeletion();'
        ],
        pitfalls: [
          'Mutating an object while stored in a TreeSet corrupts the BST order invariant, causing future remove() calls to fail silently.'
        ]
      },
      {
        name: 'Navigable Boundary Range Searches',
        category: 'Searching',
        signature: 'public E floor(E e) / public E ceiling(E e) / public E lower(E e) / public E higher(E e)',
        timeComplexity: 'Guaranteed O(log n)',
        spaceComplexity: 'O(1)',
        syntax: `NavigableSet<Integer> tree = new TreeSet<>(List.of(10, 20, 30, 40, 50));
Integer fl = tree.floor(25);   // Returns 20 (greatest <= 25)
Integer cl = tree.ceiling(25); // Returns 30 (least >= 25)
Integer lo = tree.lower(20);   // Returns 10 (strictly < 20)
Integer hi = tree.higher(40);  // Returns 50 (strictly > 40)
NavigableSet<Integer> range = tree.subSet(15, true, 45, false);`,
        internalWorking: 'getFloorEntry(k) descends tree tracking candidate matches. If current node > key, branches left. If current node <= key, records current node as best candidate and branches right. Completes in O(log n) depth without scanning entire tree.',
        mechanics: [
          'Starts binary search at root node;',
          'Branches left or right comparing key;',
          'Tracks closest boundary candidate in O(log n) tree depth;'
        ],
        pitfalls: [
          'subSet() views throw IllegalArgumentException if you try to insert an element outside the specified range bounds.'
        ]
      },
      {
        name: 'Inherent In-Order BST Traversal',
        category: 'Sorting',
        signature: 'public Iterator<E> iterator() / public NavigableSet<E> descendingSet()',
        timeComplexity: 'O(n) total iteration; O(1) descending view',
        spaceComplexity: 'O(1)',
        syntax: `// Ascending in-order traversal
for (int num : tree) {
    System.out.println(num); // Prints in sorted natural order
}

// Reverse order navigable view
NavigableSet<Integer> reverse = tree.descendingSet();`,
        internalWorking: 'TreeSet is inherently sorted at all times. Iteration executes in-order traversal using the successor(Entry t) algorithm: if t has a right child, successor is leftmost node of right subtree; otherwise climbs parent pointers until finding a left-child link.',
        mechanics: [
          'Starts iterator at firstEntry() (leftmost leaf node);',
          'Advances using successor(Entry t) in amortized O(1) per step;',
          'descendingSet() wraps tree in DescendingSubMap view with inverted comparator;'
        ],
        pitfalls: [
          'descendingSet() is a backed view; modifications to the descending set directly mutate the underlying tree!'
        ]
      }
    ],
    scenarios: [
      { id: 1, domain: 'Stock Exchange Limit Order Book', problem: 'Matching incoming buy/sell limit orders against the best bid and best ask continuously.', solution: 'TreeSet maintains sorted price levels with O(1) access to first() (lowest ask) and last() (highest bid).' },
      { id: 2, domain: 'Live Gaming Tournament Leaderboard', problem: 'Rendering live top 100 players and querying players within a specific score bracket.', solution: 'TreeSet.subSet(minScore, maxScore) returns real-time score range slices in O(log n).' },
      { id: 3, domain: 'Dynamic Cloud Server Auto-Scaler', problem: 'Selecting the closest server instance matching incoming CPU/RAM resource requests.', solution: 'tree.ceiling(requiredMemory) finds the most cost-effective server with sufficient capacity.' },
      { id: 4, domain: 'Hotel Room Pricing Engine', problem: 'Looking up dynamic room rates for any calendar date without storing every single day.', solution: 'tree.floor(checkInDate) finds the most recent applicable seasonal rate bracket.' },
      { id: 5, domain: 'Telecom Geolocation Cell Tower Router', problem: 'Routing mobile calls to the closest cell tower frequency boundary.', solution: 'tree.floor() and tree.ceiling() identify nearest boundary frequencies in O(log n).' },
      { id: 6, domain: 'E-Commerce Price Range Filter', problem: 'Filtering catalog products between $50 and $200 with active price updates.', solution: 'TreeSet.subSet(50, true, 200, true) provides a live dynamic price range view.' },
      { id: 7, domain: 'IP Geolocation Subnet Resolver', problem: 'Resolving numeric IP address to geographic country using CIDR IP ranges.', solution: 'tree.floor(ipNumber) instantly resolves the start IP of the covering subnet block.' },
      { id: 8, domain: 'Ride-Sharing Nearest Driver Matcher', problem: 'Finding nearby available drivers ranked by distance from pickup location.', solution: 'TreeSet continuously orders available drivers by proximity distance.' },
      { id: 9, domain: 'Financial Audit Timestamp Indexer', problem: 'Searching transaction events that occurred between 09:00:00 and 09:15:00 UTC.', solution: 'TreeSet.subSet(startTime, endTime) extracts time-sliced audit logs with zero scan overhead.' },
      { id: 10, domain: 'High-Frequency Trading Tick Filter', problem: 'Eliminating duplicate price ticks while maintaining chronological timestamp sequence.', solution: 'TreeSet deduplicates and sorts incoming market ticks in one integrated structure.' },
      { id: 11, domain: 'Database B-Tree Index Simulator', problem: 'Demonstrating balanced tree range lookups and binary split rebalancing.', solution: 'TreeSet mirrors relational database indexing algorithms directly in JVM memory.' },
      { id: 12, domain: 'Airport Runway Slot Scheduler', problem: 'Allocating arrival and departure time slots with guaranteed 5-minute spacing.', solution: 'tree.floor(slot) and tree.ceiling(slot) check adjacent slot spacing in O(log n).' },
      { id: 13, domain: 'SLA Alert Threshold Escalator', problem: 'Determining which severity alert tier to trigger based on error rate percentage.', solution: 'tree.floor(errorRate) matches the highest triggered severity rule.' },
      { id: 14, domain: 'Memory Segment Allocator (Buddy System)', problem: 'Finding the smallest free memory block large enough to fit an allocation request.', solution: 'tree.ceiling(requestedBytes) retrieves the optimal free memory chunk.' },
      { id: 15, domain: 'Medical Appointment Booking System', problem: 'Finding the next available doctor appointment slot after a requested time.', solution: 'tree.higher(requestedDateTime) returns the earliest upcoming available opening.' },
      { id: 16, domain: 'Compiler Lexical Scope Resolver', problem: 'Resolving nested variable declarations by closest enclosing line number.', solution: 'tree.floor(currentLineNumber) locates the closest active scope definition.' },
      { id: 17, domain: 'Log Aggregator Latency Percentile Calculator', problem: 'Calculating p50, p90, p99 latency boundaries over streaming request metrics.', solution: 'In-order traversal of TreeSet yields exact percentile thresholds without sorting passes.' },
      { id: 18, domain: 'Warehouse Inventory Bin Selector', problem: 'Selecting the closest physical warehouse aisle location for picker routing.', solution: 'NavigableSet boundary queries optimize picker route trajectory.' },
      { id: 19, domain: 'Music Synthesizer Frequency Tuner', problem: 'Snapping an arbitrary audio frequency to the nearest standard musical pitch (Hz).', solution: 'tree.floor() and ceiling() compute closest musical pitch in microseconds.' },
      { id: 20, domain: 'Backup Snapshot Retention Manager', problem: 'Finding the most recent snapshot taken prior to a disaster recovery timestamp.', solution: 'tree.floor(disasterTimestamp) retrieves the exact target restore point.' }
    ],
    interviewQAs: [
      { id: 1, category: 'Service-Based', question: 'What data structure is used internally by TreeSet in Java?', answer: 'TreeSet is backed internally by a NavigableMap (specifically TreeMap), which is implemented as a Red-Black self-balancing binary search tree.' },
      { id: 2, category: 'Service-Based', question: 'What is the difference between TreeSet and HashSet in terms of time complexity?', answer: 'HashSet provides O(1) average time complexity for basic operations using hash tables. TreeSet provides guaranteed O(log n) time complexity for add, remove, and contains using balanced binary search trees.' },
      { id: 3, category: 'Service-Based', question: 'How does TreeSet determine if two elements are duplicates?', answer: 'TreeSet relies exclusively on compareTo() (if Comparable) or compare() (if Comparator). If comparator.compare(a, b) == 0, the elements are treated as duplicates and the new element is rejected, even if a.equals(b) is false!' },
      { id: 4, category: 'Service-Based', question: 'What happens if you add null to a TreeSet in Java 7+?', answer: 'Adding null to a TreeSet throws NullPointerException because the tree must invoke compareTo() or compare() on the element to determine its position in the tree.' },
      { id: 5, category: 'Service-Based', question: 'What is the difference between floor() and lower() in TreeSet?', answer: 'floor(e) returns the greatest element in the set less than OR equal to e (<= e). lower(e) returns the greatest element strictly less than e (< e).' },
      { id: 6, category: 'Service-Based', question: 'What is the difference between ceiling() and higher() in TreeSet?', answer: 'ceiling(e) returns the least element in the set greater than OR equal to e (>= e). higher(e) returns the least element strictly greater than e (> e).' },
      { id: 7, category: 'Service-Based', question: 'How do you create a TreeSet with custom sorting order?', answer: 'Pass a custom Comparator to the constructor: new TreeSet<>(Comparator.reverseOrder()) or new TreeSet<>((a, b) -> a.getAge() - b.getAge()).' },
      { id: 8, category: 'Service-Based', question: 'What does descendingSet() return in TreeSet?', answer: 'descendingSet() returns a reverse-order NavigableSet view of the elements. It is an O(1) view backed by the original tree; mutations on the view reflect in the original set.' },
      { id: 9, category: 'Service-Based', question: 'What is a subSet() in TreeSet and is it inclusive or exclusive?', answer: 'subSet(fromElement, toElement) returns a range view. In Java 6+, subSet(from, fromInclusive, to, toInclusive) allows explicit boolean control over endpoint inclusion.' },
      { id: 10, category: 'Service-Based', question: 'Is TreeSet thread-safe?', answer: 'No. TreeSet is unsynchronized. Wrap with Collections.synchronizedNavigableSet(new TreeSet<>()) or use ConcurrentSkipListSet for concurrent lock-free sorted sets.' },
      { id: 11, category: 'Product-Based', question: 'List all 5 Red-Black Tree invariants and explain why they guarantee maximum tree depth of 2 * log(n + 1).', answer: '1. Every node is either RED or BLACK. 2. The root is always BLACK. 3. All leaf nodes (NIL) are BLACK. 4. If a node is RED, both its children must be BLACK (no two reds adjacent). 5. Every simple path from a node to descendant leaves contains the exact same number of black nodes (Black-Height). Because no two reds can be consecutive, the longest path (alternating red-black) is at most twice the length of the shortest path (all black), bounding height to 2 * log(n + 1).' },
      { id: 12, category: 'Product-Based', question: 'Explain how Left-Rotate and Right-Rotate operations work during Red-Black tree balancing.', answer: 'A Left-Rotate around node X pivots X downward-left, making its right child Y the new parent, with Y.left becoming X.right. A Right-Rotate pivots node Y downward-right, making its left child X the new parent, with X.right becoming Y.left. Both preserve binary search tree in-order traversal properties in O(1) pointer updates.' },
      { id: 13, category: 'Product-Based', question: 'Why does TreeSet violation of equals() consistency cause bugs when interoperating with Set interfaces?', answer: 'The Set contract specifies uniqueness based on equals(). If compareTo() returns 0 for two objects where equals() is false (e.g. BigDecimal("2.0") vs BigDecimal("2.00")), TreeSet treats them as duplicates and stores only one, violating the general Set specification.' },
      { id: 14, category: 'Product-Based', question: 'What is the maximum number of rotations required after an insertion vs deletion in a Red-Black Tree?', answer: 'Insertion requires at most 2 rotations to restore balance (fixAfterInsertion). Deletion requires at most 3 rotations (fixAfterDeletion). Color flips may propagate up to the root (O(log n)), but structural pointer rotations are strictly bounded by O(1).' },
      { id: 15, category: 'Product-Based', question: 'What is the memory footprint of a TreeSet node (TreeMap.Entry) on a 64-bit JVM with CompressedOOPs?', answer: 'TreeMap.Entry has: 12B object header + 4B key ref + 4B value ref + 4B left ref + 4B right ref + 4B parent ref + 1B color boolean + 7B padding = 40 bytes on heap per node.' },
      { id: 16, category: 'Product-Based', question: 'Why is ConcurrentSkipListSet preferred over synchronized TreeSet for multi-threaded systems?', answer: 'ConcurrentSkipListSet uses a lock-free Skip-List data structure with CAS pointers, providing concurrent O(log n) reads and writes without thread contention locks.' },
      { id: 17, category: 'Product-Based', question: 'How does in-order traversal of a Red-Black Tree achieve O(n) iteration time without external stacks?', answer: 'TreeSet iterators use the successor(Entry<K,V> t) algorithm. If t has a right child, successor is leftmost node in right subtree. If no right child, it traverses up parent pointers until it finds a node that is the left child of its parent, completing in amortized O(1) per step.' },
      { id: 18, category: 'Product-Based', question: 'What happens if you modify an element in a TreeSet such that its sort key changes?', answer: 'The node remains in its old tree position, violating the binary search tree invariant (left < root < right). Subsequent search queries will fail, and tree balancing rotations will corrupt the tree structure.' },
      { id: 19, category: 'Product-Based', question: 'How does TreeSet Spliterator split its tree elements for parallel stream processing?', answer: 'TreeMapSpliterator inspects root/subtree nodes. trySplit() detaches the left subtree as a sub-spliterator, keeping the right subtree and root for the current spliterator, enabling recursive divide-and-conquer in O(log n) tree depth.' },
      { id: 20, category: 'Product-Based', question: 'Compare Red-Black Trees (used in TreeSet) with AVL Trees in terms of lookup vs mutation performance.', answer: 'AVL Trees maintain stricter balance (height difference <= 1), yielding slightly faster lookups (fewer hops). Red-Black Trees have looser balance (height difference <= 2x), requiring fewer rotations during insertions/deletions, making Red-Black trees superior for write-heavy general-purpose collections.' }
    ],
    quizzes: [
      { id: 1, difficulty: 'Easy', question: 'What data structure is used internally by TreeSet in Java?', options: ['A) Hash table', 'B) Red-Black self-balancing binary search tree', 'C) Binary Min-Heap', 'D) B-Tree'], correctOption: 'B', explanation: 'TreeSet is backed by TreeMap which uses a Red-Black Binary Search Tree.' },
      { id: 2, difficulty: 'Easy', question: 'What is the time complexity of add(), remove(), and contains() in a TreeSet with n elements?', options: ['A) O(1)', 'B) O(log n)', 'C) O(n)', 'D) O(n log n)'], correctOption: 'B', explanation: 'Balanced binary search tree height is bounded by 2 * log(n + 1), guaranteeing O(log n).' },
      { id: 3, difficulty: 'Easy', question: 'What happens if you attempt to add null to a TreeSet in Java 8+?', options: ['A) Stored at root', 'B) Stored as leftmost child', 'C) Throws NullPointerException', 'D) Ignored silently'], correctOption: 'C', explanation: 'TreeSet invokes compareTo() which throws NullPointerException on null.' },
      { id: 4, difficulty: 'Easy', question: 'Which method returns the greatest element less than or equal to a given key in TreeSet?', options: ['A) lower()', 'B) floor()', 'C) ceiling()', 'D) higher()'], correctOption: 'B', explanation: 'floor(k) returns the greatest element <= k.' },
      { id: 5, difficulty: 'Easy', question: 'Which method returns the least element strictly greater than a given key in TreeSet?', options: ['A) higher()', 'B) ceiling()', 'C) next()', 'D) upper()'], correctOption: 'A', explanation: 'higher(k) returns the least element > k.' },
      { id: 6, difficulty: 'Easy', question: 'How does TreeSet determine equality between two elements?', options: ['A) a.equals(b)', 'B) a.hashCode() == b.hashCode()', 'C) compareTo(b) == 0 or compare(a, b) == 0', 'D) a == b'], correctOption: 'C', explanation: 'TreeSet relies exclusively on compareTo() or compare() == 0.' },
      { id: 7, difficulty: 'Easy', question: 'In what order does an enhanced for-loop iterate over a TreeSet?', options: ['A) Non-deterministic', 'B) Insertion order', 'C) Ascending sorted order (Natural/Comparator)', 'D) Descending sorted order'], correctOption: 'C', explanation: 'Iteration performs an in-order tree traversal, yielding ascending sorted order.' },
      { id: 8, difficulty: 'Medium', question: 'What is the color of the root node in a valid Red-Black Tree?', options: ['A) Red', 'B) Black', 'C) Either Red or Black', 'D) Yellow'], correctOption: 'B', explanation: 'Invariant #2 of Red-Black trees strictly requires the root node to be BLACK.' },
      { id: 9, difficulty: 'Medium', question: 'Can a Red-Black Tree have two consecutive RED nodes along any path?', options: ['A) Yes, up to 3', 'B) No, if a node is red, both children must be black', 'C) Only at leaf level', 'D) Yes, during deletion'], correctOption: 'B', explanation: 'Invariant #4 states no two adjacent red nodes can exist on any path.' },
      { id: 10, difficulty: 'Medium', question: 'What is the maximum number of rotations required to restore balance after an insertion in a Red-Black Tree?', options: ['A) 1', 'B) 2', 'C) O(log n)', 'D) O(n)'], correctOption: 'B', explanation: 'At most 2 rotations are required to restore Red-Black balance after insertion.' },
      { id: 11, difficulty: 'Medium', question: 'What does treeSet.descendingSet() return?', options: ['A) A new cloned collection', 'B) A reverse-order NavigableSet view backed by the original tree', 'C) An array', 'D) An unmodifiable list'], correctOption: 'B', explanation: 'descendingSet() returns a live inverted view of the underlying tree.' },
      { id: 12, difficulty: 'Medium', question: 'What is the difference between floor(50) and lower(50) if the set contains [20, 50, 80]?', options: ['A) Both return 20', 'B) Both return 50', 'C) floor(50) returns 50; lower(50) returns 20', 'D) floor(50) returns 20; lower(50) returns 50'], correctOption: 'C', explanation: 'floor is <= (returns 50); lower is strictly < (returns 20).' },
      { id: 13, difficulty: 'Medium', question: 'Which interface provides navigable methods like floor, ceiling, pollFirst, pollLast in Java?', options: ['A) SortedSet', 'B) NavigableSet', 'C) OrderedSet', 'D) IndexableSet'], correctOption: 'B', explanation: 'NavigableSet extends SortedSet with boundary and navigation queries.' },
      { id: 14, difficulty: 'Medium', question: 'What happens if compareTo() is inconsistent with equals() in a class stored in TreeSet?', options: ['A) Throws InconsistentComparisonException', 'B) TreeSet works but violates the general Set contract regarding uniqueness', 'C) TreeSet reverts to HashSet', 'D) JVM crashes'], correctOption: 'B', explanation: 'TreeSet functions using compareTo(), but may reject elements where equals() is false.' },
      { id: 15, difficulty: 'Hard', question: 'What is the maximum theoretical height of a Red-Black Tree containing n nodes?', options: ['A) log2(n)', 'B) 2 * log2(n + 1)', 'C) n - 1', 'D) sqrt(n)'], correctOption: 'B', explanation: 'Height is mathematically bounded to at most 2 * log2(n + 1).' },
      { id: 16, difficulty: 'Hard', question: 'What is the black-height of a Red-Black Tree?', options: ['A) Total number of black nodes in the tree', 'B) The number of black nodes on any simple path from a node to a leaf', 'C) Height of root node', 'D) Total depth divided by 2'], correctOption: 'B', explanation: 'Black-height is the uniform count of black nodes from a node down to any leaf.' },
      { id: 17, difficulty: 'Hard', question: 'How does successor(Entry t) find the next in-order node when t has no right child?', options: ['A) Returns null', 'B) Traverses up parent pointers until it finds a node that is the left child of its parent', 'C) Restarts from root', 'D) Traverses left child'], correctOption: 'B', explanation: 'It climbs up parent pointers until a left-child transition is encountered.' },
      { id: 18, difficulty: 'Hard', question: 'Which concurrent collection is the thread-safe equivalent of TreeSet?', options: ['A) ConcurrentTreeSet', 'B) ConcurrentSkipListSet', 'C) CopyOnWriteArraySet', 'D) SynchronizedTreeSet'], correctOption: 'B', explanation: 'ConcurrentSkipListSet provides scalable lock-free sorted set operations.' },
      { id: 19, difficulty: 'Hard', question: 'Why are Red-Black trees chosen for TreeMap/TreeSet over AVL trees in OpenJDK?', options: ['A) Red-Black trees require fewer rotations during insertions and deletions', 'B) AVL trees cannot store objects', 'C) Red-Black trees use less memory', 'D) AVL trees are patented'], correctOption: 'A', explanation: 'Looser balance bounds reduce rotation overhead during mutations.' },
      { id: 20, difficulty: 'Hard', question: 'What is the time complexity of building a TreeSet from a pre-sorted collection of size N in Java?', options: ['A) O(N log N)', 'B) O(N) using linear tree construction', 'C) O(N^2)', 'D) O(1)'], correctOption: 'B', explanation: 'TreeMap constructor optimizes pre-sorted maps/sets using O(N) linear-time tree building.' }
    ]
  },

  HashMap: {
    id: 5,
    key: 'HashMap',
    title: 'HashMap',
    category: 'Map',
    badge: 'Buckets + Treeification',
    complexity: 'O(1) Avg Associative Lookup',
    mindMap: `Map<K, V> -> HashMap<K, V>
  |-- Backing Array   : Node<K,V>[] table (Power-of-Two capacity)
  |-- Bitmask Index   : index = (n - 1) & (hash ^ (hash >>> 16))
  |-- Treeification   : Bin Size >= 8 AND Total Capacity >= 64 -> Red-Black Tree
  +-- Resizing Rule   : Size > Capacity * 0.75 -> 2x Capacity`,
    architecture: {
      definition: 'A hash table-based key-value map providing constant time associative lookups, insertions, and removals using separate chaining and Red-Black treeification.',
      coreArchitecture: 'Backed by dynamic Node<K,V>[] table. Computes bin index via bitmask (n - 1) & hash. Resolves collisions via separate chaining. In Java 8+, converts bucket linked list into Red-Black Tree (TreeNode) when bin count >= 8 and table capacity >= 64, reverting to list when bin count drops to 6.',
      basicSyntax: `// Initializing with known initial capacity
Map<String, Integer> map = new HashMap<>(32, 0.75f);
map.put("AWS_CPU", 45); // O(1) average put
int val = map.getOrDefault("AWS_CPU", 0); // O(1) direct lookup
map.computeIfAbsent("MEM_GB", k -> 64); // Atomic functional compute
map.remove("AWS_CPU");`,
      keyPoints: [
        'Permits one null key (placed in bucket index 0 with hash 0) and multiple null values.',
        'Table capacity is strictly constrained to powers of two (2^n) to optimize bitmask indexing.',
        'Threshold formula: threshold = capacity * loadFactor (default load factor is 0.75).',
        'Not thread-safe; concurrent structural writes can corrupt internal node pointer chains.',
        'Treeification protects against algorithmic hash collision (HashDoS) attacks, bounding worst case to O(log n).'
      ],
      advantages: [
        'High performance O(1) average time complexity for associative storage and retrieval.',
        'Treeification protects against performance degradation during heavy hash collisions.',
        'Rich modern functional methods: computeIfAbsent, computeIfPresent, merge, getOrDefault.'
      ],
      disadvantages: [
        'Resizing allocates a 2x table and re-indexes all nodes (O(n) latency cost spike).',
        'Higher memory overhead per entry (32 bytes per Node instance on 64-bit JVMs).',
        'Iteration order is non-deterministic and shifts across table resizing passes.'
      ]
    },
    operations: [
      {
        name: 'Key Hashing & Spread Bitmask',
        category: 'Compare',
        signature: 'static final int hash(Object key)',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        syntax: `// OpenJDK 16-bit spread hash calculation
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

// Bitmask bucket index
int index = (n - 1) & hash;`,
        internalWorking: 'Computes 16-bit high-to-low XOR mixer: (h = key.hashCode()) ^ (h >>> 16). Because table size is a power of two, (n - 1) & hash only uses low bits. Mixing high bits prevents collisions when keys differ only in high-order bit patterns.',
        mechanics: [
          'Calculates key.hashCode();',
          'Shifts high bits right by 16 and XORs with h;',
          'Applies bitmask (table.length - 1) & hash in 1 CPU cycle;'
        ],
        pitfalls: [
          'Using a mutable object as a HashMap key causes hash drift; if the object is mutated, subsequent get(key) calls look in the wrong bucket and fail!'
        ]
      },
      {
        name: 'Put & Separate Chaining / Treeification',
        category: 'Insertion',
        signature: 'public V put(K key, V value) / public V putIfAbsent(K key, V value)',
        timeComplexity: 'O(1) average; O(log n) worst-case collision',
        spaceComplexity: '32B per Node',
        syntax: `Map<String, Integer> map = new HashMap<>(32);
map.put("CPU_USAGE", 85); // O(1) put
map.putIfAbsent("CPU_USAGE", 90); // Preserves existing 85
map.computeIfAbsent("MEM_GB", k -> calculateMemory());`,
        internalWorking: 'Computes hash and inspects table[(n - 1) & hash]. If empty, creates new Node. If populated, traverses bin; if existing key matches hash and equals(), overwrites value. Otherwise appends Node at tail. If bin size >= 8 and capacity >= 64, calls treeifyBin() to convert list to Red-Black tree. If ++size > threshold, triggers 2x resize().',
        mechanics: [
          'Locates bucket index via bitmask;',
          'Tail-appends Node in linked list (Java 8+);',
          'Treeifies bin if collisions >= 8 and capacity >= 64;',
          'Resizes table (2x) when size > threshold;'
        ],
        pitfalls: [
          'Concurrent writes in multi-threaded environments cause corrupted pointer chains and data loss. Use ConcurrentHashMap for multithreading.'
        ]
      },
      {
        name: 'Node Deletion & Untreeification',
        category: 'Deletion',
        signature: 'public V remove(Object key) / public boolean remove(Object key, Object value)',
        timeComplexity: 'O(1) average; O(log n) worst-case',
        spaceComplexity: 'O(1)',
        syntax: `Integer oldVal = map.remove("CPU_USAGE"); // Removes entry, returns old value
boolean removed = map.remove("CPU_USAGE", 85); // Conditional removal (exact match)`,
        internalWorking: 'Hashes key, locates bucket (n - 1) & hash, finds target node using hash and equals(). Unlinks node from list (prev.next = node.next) or calls removeTreeNode(). Reverts tree to linked list (untreeify) if bin size drops to 6 during removal. Decrements size and returns old value.',
        mechanics: [
          'Locates target bucket slot;',
          'Matches node via hash and equals();',
          'Slices out node and checks untreeify threshold (6);',
          'Decrements size and increments modCount;'
        ],
        pitfalls: [
          'Modifying map while iterating over keySet() or entrySet() throws ConcurrentModificationException. Use iterator.remove() or map.entrySet().removeIf().'
        ]
      },
      {
        name: 'Associative Key & Value Lookup',
        category: 'Searching',
        signature: 'public V get(Object key) / public boolean containsKey(Object key)',
        timeComplexity: 'O(1) average; O(log n) worst-case; O(n) for containsValue()',
        spaceComplexity: 'O(1)',
        syntax: `Integer val = map.get("CPU_USAGE"); // O(1) instant key lookup
int safeVal = map.getOrDefault("MEM_GB", 16); // Fallback if absent
boolean hasKey = map.containsKey("CPU_USAGE"); // O(1)
boolean hasVal = map.containsValue(85); // O(n) table scan`,
        internalWorking: 'Computes hash and inspects table[(n - 1) & hash]. Checks root node directly (first.hash == hash && (first.key == key || key.equals(first.key))). If first node matches, returns value immediately. If first node is TreeNode, calls find() in O(log n); otherwise iterates next chain comparing equals().',
        mechanics: [
          'Computes hash and locates bucket slot;',
          'Direct root node check optimizes 90%+ lookups;',
          'TreeNode.find() descends balanced Red-Black tree in O(log n);'
        ],
        pitfalls: [
          'map.get(key) returning null is ambiguous: it could mean key is absent OR key maps explicitly to null! Use map.containsKey(key) to distinguish.'
        ]
      },
      {
        name: 'Key vs Value Sorting Conversions',
        category: 'Sorting',
        signature: 'new TreeMap<>(map) / map.entrySet().stream().sorted(...)',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n) auxiliary collection',
        syntax: `// Sort by Keys via TreeMap
Map<String, Integer> keySorted = new TreeMap<>(hashMap);

// Sort by Values via Stream into LinkedHashMap
Map<String, Integer> valSorted = hashMap.entrySet().stream()
    .sorted(Map.Entry.comparingByValue())
    .collect(Collectors.toMap(
        Map.Entry::getKey,
        Map.Entry::getValue,
        (e1, e2) -> e1,
        LinkedHashMap::new
    ));`,
        internalWorking: 'HashMap has no native sorting order. To sort by keys, transfer entries to a TreeMap (Red-Black BST). To sort by values, stream entrySet(), sort with Map.Entry.comparingByValue(), and collect into an insertion-ordered LinkedHashMap.',
        mechanics: [
          'Scans table buckets;',
          'Sorts keys via TreeMap or streams entrySet() with comparator;',
          'Collects into LinkedHashMap to preserve computed sort order;'
        ],
        pitfalls: [
          'Collecting sorted stream entries into standard HashMap loses sort order immediately. You MUST collect into a LinkedHashMap!'
        ]
      }
    ],
    scenarios: [
      { id: 1, domain: 'Microservice HTTP Session Store', problem: 'Looking up user session identity attributes by Bearer token in < 1ms.', solution: 'HashMap provides O(1) token-to-session lookups with zero network overhead.' },
      { id: 2, domain: 'Distributed Database Shard Router', problem: 'Mapping database partition shard IDs to physical database connection pools.', solution: 'HashMap routes database queries to correct shard endpoints via O(1) key hashing.' },
      { id: 3, domain: 'Compiler Symbol & Variable Table', problem: 'Resolving variable names to memory offsets and types during AST compilation.', solution: 'HashMap provides instant identifier-to-type resolution across code blocks.' },
      { id: 4, domain: 'High-Speed In-Memory Cache (LRU Core)', problem: 'Caching pre-computed API responses with key-based invalidation.', solution: 'HashMap paired with doubly-linked list (LinkedHashMap) powers classic LRU caches.' },
      { id: 5, domain: 'E-Commerce Shopping Cart Aggregator', problem: 'Associating product SKU codes with item purchase quantities.', solution: 'map.merge(sku, qty, Integer::sum) increments product quantities in single atomic operations.' },
      { id: 6, domain: 'DNS Hostname Resolution Cache', problem: 'Caching IP addresses for domain names to avoid repeated DNS queries.', solution: 'HashMap matches domain names (e.g. "api.stripe.com") to IP addresses in O(1).' },
      { id: 7, domain: 'Financial Currency Exchange Rate Matrix', problem: 'Retrieving real-time FX currency conversion rates (e.g. "USD_EUR" -> 0.92).', solution: 'HashMap pairs currency pairs to exchange rates with sub-microsecond access.' },
      { id: 8, domain: 'IoT Device Telemetry State Pool', problem: 'Holding current sensor temperature and battery status by device UUID.', solution: 'HashMap synchronizes device state attributes on high-frequency MQTT updates.' },
      { id: 9, domain: 'REST API Request Header Parser', problem: 'Extracting HTTP request headers ("Authorization", "Content-Type") by name.', solution: 'HashMap parses headers into key-value pairs for fast controller access.' },
      { id: 10, domain: 'Graph Adjacency Weight Map', problem: 'Representing weighted graph edges between pairs of vertices.', solution: 'Map<Vertex, Map<Vertex, Double>> models graph edge weights with O(1) lookup.' },
      { id: 11, domain: 'User Authorization Role Registry', problem: 'Mapping user IDs to assigned security roles and permission sets.', solution: 'HashMap verifies access permissions instantly per incoming API call.' },
      { id: 12, domain: 'Real-Time Game Player Coordinates', problem: 'Tracking live (x, y, z) player coordinates indexed by player ID.', solution: 'HashMap updates and broadcasts player positions to game clients 60 times/sec.' },
      { id: 13, domain: 'Distributed Tracing Span Context', problem: 'Associating Trace IDs with active OpenTelemetry span context objects.', solution: 'HashMap stores execution spans across async microservice boundaries.' },
      { id: 14, domain: 'Stock Market Real-Time Price Book', problem: 'Storing latest trading price by ticker symbol ("AAPL" -> 220.50).', solution: 'HashMap enables instant stock quote reads during market trading sessions.' },
      { id: 15, domain: 'Internationalization (i18n) String Bundle', problem: 'Retrieving translated UI strings by message key (e.g. "btn.submit").', solution: 'HashMap provides O(1) localized string lookups during page rendering.' },
      { id: 16, domain: 'Kafka Message Partition Routing', problem: 'Mapping message routing keys to specific Kafka partition numbers.', solution: 'HashMap caches partition assignments to avoid recomputing MurmurHash.' },
      { id: 17, domain: 'API Rate Limiting Token Bucket Map', problem: 'Tracking remaining request token balances per client API key.', solution: 'HashMap maintains client rate quota counters with atomic updates.' },
      { id: 18, domain: 'Inventory Warehouse Stock Level Tracker', problem: 'Holding available stock counts by product ID across multiple fulfillment centers.', solution: 'HashMap tracks inventory counts with instant decrement during checkout.' },
      { id: 19, domain: 'Machine Learning Word Embedding Index', problem: 'Mapping vocabulary word tokens to index IDs in a deep learning embedding matrix.', solution: 'HashMap tokenizes text into vocabulary indices in linear time.' },
      { id: 20, domain: 'Payment Gateway Routing Dispatcher', problem: 'Routing credit card BIN ranges to optimal payment processing gateways.', solution: 'HashMap selects payment processor (Stripe, Adyen) based on card BIN prefix.' }
    ],
    interviewQAs: [
      { id: 1, category: 'Service-Based', question: 'How does HashMap store key-value pairs internally in Java 8+?', answer: 'HashMap uses an array of buckets (Node<K,V>[] table). Each bucket holds a singly-linked list of Node instances. When a bucket reaches 8 collisions and table capacity >= 64, it converts the list into a Red-Black Tree (TreeNode<K,V>) to guarantee O(log n) worst-case lookup.' },
      { id: 2, category: 'Service-Based', question: 'What is the default initial capacity and load factor of HashMap?', answer: 'Default initial capacity is 16 (always a power of two) and default load factor is 0.75. The resize threshold is calculated as capacity * loadFactor (16 * 0.75 = 12).' },
      { id: 3, category: 'Service-Based', question: 'How does HashMap handle null keys and null values?', answer: 'HashMap allows exactly one null key, which is always stored in bucket index 0 with a hash code of 0. It permits any number of null values.' },
      { id: 4, category: 'Service-Based', question: 'What is the difference between HashMap and Hashtable?', answer: 'Hashtable is a legacy class where all methods are synchronized (incurring performance overhead), does NOT allow null keys or values, and uses enumerators. HashMap is unsynchronized, permits one null key, and supports fail-fast iterators and treeification.' },
      { id: 5, category: 'Service-Based', question: 'What is the difference between HashMap and ConcurrentHashMap?', answer: 'HashMap is unsynchronized and not thread-safe. ConcurrentHashMap is thread-safe, uses lock-free CAS reads and synchronizes only at the bucket node level during writes, disallows null keys/values, and provides weakly consistent iterators.' },
      { id: 6, category: 'Service-Based', question: 'How does HashMap resolve hash collisions in Java 8+?', answer: 'Initially via separate chaining (singly-linked list). If collisions in a bin reach 8 and table capacity >= 64, the bin is converted into a Red-Black tree. If capacity is < 64, it resizes the table instead of treeifying.' },
      { id: 7, category: 'Service-Based', question: 'What happens during a resize() operation in HashMap?', answer: 'When size exceeds threshold, table capacity doubles (2x). A new Node array of size 2*capacity is allocated, and all existing entries are re-indexed into either their current index (low bucket) or current index + oldCapacity (high bucket).' },
      { id: 8, category: 'Service-Based', question: 'What does map.computeIfAbsent() do?', answer: 'It checks if a key exists and is non-null. If absent, it invokes the provided mapping lambda function to compute the value, inserts it into the map, and returns the computed value in a single atomic pass.' },
      { id: 9, category: 'Service-Based', question: 'What causes infinite loops in HashMap in Java 7 during concurrent resizing?', answer: 'In Java 7, resizing used head-insertion in bucket lists, which inverted element order. Concurrent resizing across threads could cause pointer circularity (nodeA.next = nodeB and nodeB.next = nodeA), resulting in 100% CPU infinite loops. Java 8 fixed this by using tail-insertion.' },
      { id: 10, category: 'Service-Based', question: 'How do you sort a HashMap by its keys vs its values?', answer: 'Sort by keys: load entries into a new TreeMap<>(map). Sort by values: stream map.entrySet(), sort with Map.Entry.comparingByValue(), and collect into a LinkedHashMap.' },
      { id: 11, category: 'Product-Based', question: 'Explain the mathematical elegance of Java 8 high-and-low bit resizing without re-calculating hashCodes.', answer: 'Because capacity is always doubled (a power of two), the bitmask (newCapacity - 1) has exactly one new high bit (equal to oldCapacity). For each node, (hash & oldCapacity) is either 0 or oldCapacity. If 0, the node stays at oldIndex. If non-zero, it moves to oldIndex + oldCapacity. This splits nodes into two clean sub-lists (loHead and hiHead) with zero hash recalculations.' },
      { id: 12, category: 'Product-Based', question: 'Why does HashMap require key immutable objects (like String or Integer) for optimal performance?', answer: 'If a key object is mutable and its fields change after insertion, its hashCode() changes. Searching for the key later will hash to a different bucket, making the entry permanently unreachable and causing memory leaks.' },
      { id: 13, category: 'Product-Based', question: 'Explain what a HashDoS attack is and how Java 8 treeification mitigates it.', answer: 'Attackers craft millions of input strings sharing the exact same hashCode. In Java 7, this turned HashMap lookups into an O(N) linked list scan, causing CPU starvation with small payloads. Java 8 treeifies bins at 8 collisions into Red-Black trees, bounding worst-case lookup to O(log N).' },
      { id: 14, category: 'Product-Based', question: 'Why must total table capacity be >= 64 (MIN_TREEIFY_CAPACITY) before treeifying a bucket?', answer: 'When table capacity is small (e.g. 16), collisions are more likely caused by limited table size rather than poor hash functions. Resizing the table (doubling capacity) spreads out collisions more effectively and cheaply than building Red-Black tree structures.' },
      { id: 15, category: 'Product-Based', question: 'What is the exact memory footprint of a HashMap containing 100,000 String-to-Integer entries in 64-bit JVM?', answer: 'HashMap: 48B + table array (131,072 slots * 4B = 524KB) + 100,000 Node instances (each 32B = 3.2MB) + String/Integer objects ≈ 7-8MB on heap.' },
      { id: 16, category: 'Product-Based', question: 'How does HashMap resolve ties in TreeNode ordering when keys do NOT implement Comparable?', answer: 'If keys do not implement Comparable or have identical compare results, tieBreakOrder(Object a, Object b) uses System.identityHashCode(a).compareTo(System.identityHashCode(b)) to provide a deterministic total ordering.' },
      { id: 17, category: 'Product-Based', question: 'What is the difference between fail-fast in HashMap vs weakly-consistent in ConcurrentHashMap?', answer: 'HashMap iterators throw ConcurrentModificationException if modCount changes during iteration. ConcurrentHashMap iterators reflect state at iterator creation, handle concurrent modifications gracefully, never throw CME, but may or may not reflect post-creation updates.' },
      { id: 18, category: 'Product-Based', question: 'Explain why HashMap load factor is 0.75 and what happens if you set it to 0.1 vs 1.5.', answer: 'Load factor 0.75 balances space and time. Setting LF to 0.1 causes frequent resizes, allocating large mostly-empty arrays (wasting RAM, speeding lookups). Setting LF to 1.5 saves RAM but causes severe collisions, degrading lookups towards O(log n) / O(n).' },
      { id: 19, category: 'Product-Based', question: 'How does HashMap.merge(key, value, remappingFunction) work under the hood?', answer: 'It looks up key. If absent or null, it inserts value. If present, it computes remappingFunction.apply(oldValue, value). If the result is null, it removes the key; otherwise, it updates the value, all in a single bucket lookup pass.' },
      { id: 20, category: 'Product-Based', question: 'How would you design a high-throughput, off-heap, zero-GC key-value hash map in Java?', answer: 'Use off-heap memory via Foreign Memory API (MemorySegment). Use open addressing (Robin Hood hashing or Linear Probing) over flat byte buffers, encode keys/values into compact binary structs, and use CAS primitives for lock-free multi-threaded updates.' }
    ],
    quizzes: [
      { id: 1, difficulty: 'Easy', question: 'What is the default initial capacity of a HashMap in Java?', options: ['A) 8', 'B) 10', 'C) 16', 'D) 32'], correctOption: 'C', explanation: 'Default initial capacity is 16 (always a power of two).' },
      { id: 2, difficulty: 'Easy', question: 'What is the default load factor in HashMap?', options: ['A) 0.50', 'B) 0.75', 'C) 0.80', 'D) 1.0'], correctOption: 'B', explanation: '0.75 provides an optimal balance between space and time complexity.' },
      { id: 3, difficulty: 'Easy', question: 'How many null keys does HashMap permit?', options: ['A) None (throws NPE)', 'B) Exactly one', 'C) Unlimited', 'D) Up to 16'], correctOption: 'B', explanation: 'HashMap allows exactly one null key, stored in bucket index 0.' },
      { id: 4, difficulty: 'Easy', question: 'What is the average time complexity of map.get(key) in a HashMap?', options: ['A) O(1)', 'B) O(log n)', 'C) O(n)', 'D) O(n log n)'], correctOption: 'A', explanation: 'Direct bucket index calculation yields O(1) average access time.' },
      { id: 5, difficulty: 'Easy', question: 'Which method returns a default value if the requested key is not present in the map?', options: ['A) map.get()', 'B) map.getOrDefault()', 'C) map.findOrDefault()', 'D) map.fallback()'], correctOption: 'B', explanation: 'map.getOrDefault(key, defaultValue) returns defaultValue if key is absent.' },
      { id: 6, difficulty: 'Easy', question: 'Is HashMap thread-safe by default?', options: ['A) Yes', 'B) No, unsynchronized for maximum throughput', 'C) Only for read operations', 'D) Only in Java 21+'], correctOption: 'B', explanation: 'HashMap is unsynchronized; use ConcurrentHashMap for multithreading.' },
      { id: 7, difficulty: 'Easy', question: 'What is the return value of map.put(key, value) if the key was NOT previously present?', options: ['A) true', 'B) null', 'C) 0', 'D) The inserted value'], correctOption: 'B', explanation: 'put() returns the previous value associated with key, or null if key was absent.' },
      { id: 8, difficulty: 'Medium', question: 'What two conditions MUST be met before a HashMap bucket is converted into a Red-Black Tree in Java 8+?', options: ['A) Bin count >= 8 AND Total Capacity >= 64', 'B) Bin count >= 16 AND Total Capacity >= 32', 'C) Bin count >= 8 AND Load Factor >= 0.75', 'D) Bin count >= 4 AND Total Capacity >= 128'], correctOption: 'A', explanation: 'TREEIFY_THRESHOLD is 8 AND MIN_TREEIFY_CAPACITY is 64.' },
      { id: 9, difficulty: 'Medium', question: 'Why are table capacities in HashMap strictly constrained to powers of two (2^n)?', options: ['A) JVM memory allocation rule', 'B) Enables replacing modulo division (hash % n) with bitmask (n - 1) & hash', 'C) JIT compiler requirement', 'D) Cache line size limitation'], correctOption: 'B', explanation: '(n - 1) & hash performs ultra-fast bitwise masking equivalent to modulo.' },
      { id: 10, difficulty: 'Medium', question: 'What happens when HashMap size exceeds threshold (capacity * loadFactor)?', options: ['A) Rejects subsequent puts', 'B) Doubles capacity (2x) and re-indexes all entries', 'C) Converts all buckets to trees', 'D) Trims null values'], correctOption: 'B', explanation: 'resize() allocates a 2x table and re-indexes all existing nodes.' },
      { id: 11, difficulty: 'Medium', question: 'How did Java 8 eliminate the infinite loop resizing bug present in Java 7 HashMap?', options: ['A) Added synchronization locks', 'B) Switched from head-insertion to tail-insertion during resizing', 'C) Switched to SkipLists', 'D) Banned multi-threading'], correctOption: 'B', explanation: 'Tail-insertion preserves element order during resize, preventing circular pointer loops.' },
      { id: 12, difficulty: 'Medium', question: 'What does map.computeIfPresent(key, remappingFunction) do if the key exists?', options: ['A) Throws DuplicateKeyException', 'B) Computes new value using remappingFunction and updates entry', 'C) Returns old value without change', 'D) Deletes the key unconditionally'], correctOption: 'B', explanation: 'computeIfPresent updates the value if the key exists and current value is non-null.' },
      { id: 13, difficulty: 'Medium', question: 'What is the threshold to untreeify a Red-Black tree bucket back to a linked list during removal?', options: ['A) 8', 'B) 6', 'C) 4', 'D) 2'], correctOption: 'B', explanation: 'UNTREEIFY_THRESHOLD is 6.' },
      { id: 14, difficulty: 'Medium', question: 'Why is String considered the ideal key type for a HashMap?', options: ['A) Strings are small', 'B) String is immutable and caches its hashCode, avoiding recomputation', 'C) String implements RandomAccess', 'D) Strings avoid garbage collection'], correctOption: 'B', explanation: 'Immutability prevents hash drift and hashCode caching provides O(1) hashing speed.' },
      { id: 15, difficulty: 'Hard', question: 'During 2x resize in Java 8, how does HashMap determine if a node stays at oldIndex or moves to oldIndex + oldCapacity?', options: ['A) Recomputes hashCode from scratch', 'B) Checks if (hash & oldCapacity) == 0 (low bit vs high bit)', 'C) Checks node color', 'D) Uses random coin toss'], correctOption: 'B', explanation: '(hash & oldCapacity) == 0 places node in loHead; non-zero places it in hiHead.' },
      { id: 16, difficulty: 'Hard', question: 'What is the worst-case time complexity of HashMap.get(key) in Java 8+ under pathological hash collisions?', options: ['A) O(1)', 'B) O(log n)', 'C) O(n)', 'D) O(n log n)'], correctOption: 'B', explanation: 'Treeification bounds worst-case bucket depth to O(log n).' },
      { id: 17, difficulty: 'Hard', question: 'What is the purpose of tieBreakOrder() in HashMap.TreeNode?', options: ['A) Selects root node', 'B) Provides consistent total ordering via System.identityHashCode when keys do not implement Comparable', 'C) Balances tree rotations', 'D) Resolves thread locks'], correctOption: 'B', explanation: 'Deterministic tie-breaking ensures consistent BST positioning.' },
      { id: 18, difficulty: 'Hard', question: 'How does ConcurrentHashMap achieve high write concurrency without full table locking?', options: ['A) Global synchronized mutex', 'B) Lock-free CAS for empty buckets and synchronized locking on individual bucket bin head nodes', 'C) Read-Write lock on whole table', 'D) Copying array on each write'], correctOption: 'B', explanation: 'Synchronizing only on bin head nodes confines contention to colliding keys.' },
      { id: 19, difficulty: 'Hard', question: 'Why does HashMap.values() return a Collection view rather than a Set?', options: ['A) Java syntax limitation', 'B) HashMap values can contain duplicate elements', 'C) Values cannot be iterated', 'D) Performance optimization'], correctOption: 'B', explanation: 'Multiple keys can map to identical values, so values() is a Collection, not a Set.' },
      { id: 20, difficulty: 'Hard', question: 'What happens if a custom key class overrides equals() but fails to override hashCode()?', options: ['A) Compiler error', 'B) Two logically equal objects will produce different hash codes and land in different buckets, violating map uniqueness', 'C) Automatically falls back to field comparison', 'D) JVM throws RuntimeException'], correctOption: 'B', explanation: 'Violating hashCode contract causes duplicate key entries and lookup failures.' }
    ]
  },

  Streams: {
    id: 6,
    key: 'Streams',
    title: 'Java Streams',
    category: 'Stream',
    badge: 'Lazy Functional Pipeline',
    complexity: 'O(n) Lazy Map-Reduce',
    mindMap: `BaseStream -> Stream<T> (Functional Map-Reduce Pipeline)
  |-- Source Stage       : Collection.stream(), Arrays.stream()
  |-- Intermediate (Lazy): filter(), map(), sorted(), distinct(), flatMap()
  |-- Terminal (Eager)   : collect(), reduce(), forEach(), findFirst()
  +-- Parallelism        : Spliterator.trySplit() -> ForkJoinPool.commonPool()`,
    architecture: {
      definition: 'A functional, declarative pipeline supporting lazy map-reduce transformations, element filtering, and parallel evaluation over data sequences.',
      coreArchitecture: 'Built atop Spliterator sources. Stream stages form a doubly-linked pipeline of Sink objects (ReferencePipeline). Intermediate operations (filter, map) wrap downstream sinks and evaluate lazily. Execution occurs in a single pass only upon triggering a Terminal operation (collect, reduce, findFirst).',
      basicSyntax: `// Declarative Map-Reduce Stream Pipeline
List<String> results = orders.stream()
    .filter(o -> o.getStatus() == Status.COMPLETED) // Lazy stateless filter
    .map(Order::getUserId)                          // Lazy transformation
    .distinct()                                     // Stateful intermediate barrier
    .sorted()                                       // Stateful sort barrier
    .limit(10)                                      // Short-circuit truncation
    .toList();                                      // Terminal collector`,
      keyPoints: [
        'Streams do not store data; they transform elements from underlying collections, arrays, or I/O channels.',
        'Intermediate operations return a new lazy Stream without executing processing steps until terminal call.',
        'Terminal operations (collect, reduce, forEach, findFirst) trigger single-pass pipeline execution.',
        'Streams cannot be reused once consumed; invoking operations on a closed stream throws IllegalStateException.',
        'Supports declarative parallel processing via .parallelStream() leveraging Spliterator.trySplit() and ForkJoinPool.'
      ],
      advantages: [
        'High readability, declarative code eliminating explicit loop state and accumulator boilerplate.',
        'Lazy evaluation optimizes efficiency through short-circuiting (findFirst, anyMatch).',
        'Effortless multi-core CPU parallelization via .parallelStream().'
      ],
      disadvantages: [
        'Performance overhead from lambda allocations and object boxing on small datasets.',
        'Difficult step-by-step stack-trace debugging compared to standard for-loops.',
        'Uncoordinated parallel streams can saturate ForkJoinPool.commonPool(), stalling unrelated tasks.'
      ]
    },
    operations: [
      {
        name: 'Predicate Matching & Equality',
        category: 'Compare',
        signature: 'boolean anyMatch(Predicate) / boolean allMatch(Predicate) / boolean noneMatch(Predicate)',
        timeComplexity: 'O(1) to O(n) (Short-Circuit)',
        spaceComplexity: 'O(1)',
        syntax: `// Short-circuit matching
boolean hasFraud = transactions.stream()
    .anyMatch(t -> t.getAmount() > 10000); // Aborts on first match

boolean allActive = users.stream()
    .allMatch(User::isActive);`,
        internalWorking: 'Short-circuiting terminal comparison operations. Constructs MatchOp sink. During iteration, when a matching element satisfies predicate, sets stop cancellation flag, breaking upstream Spliterator loop immediately without processing remaining elements.',
        mechanics: [
          'Wraps predicate inside short-circuiting MatchOp sink;',
          'Evaluates elements one-by-one lazily;',
          'Cancels upstream iteration upon finding first decisive element;'
        ],
        pitfalls: [
          'allMatch on an empty stream returns TRUE (vacuous truth in boolean logic). Be mindful when checking empty datasets.'
        ]
      },
      {
        name: 'Stream Generation & Source Ingestion',
        category: 'Insertion',
        signature: 'Stream.of(T...) / Collection.stream() / Stream.builder()',
        timeComplexity: 'O(1) pipeline creation',
        spaceComplexity: 'O(1)',
        syntax: `Stream<String> s1 = list.stream(); // Wraps source Spliterator
Stream<Integer> s2 = Stream.of(1, 2, 3, 4, 5); // Array-backed stream
Stream<Double> s3 = Stream.generate(Math::random).limit(10); // Infinite generator`,
        internalWorking: 'Instantiates ReferencePipeline.Head wrapping source Spliterator. Stage tracks encounter characteristics (SIZED, DISTINCT, ORDERED). Zero element evaluation occurs at creation time.',
        mechanics: [
          'Obtains Spliterator from source collection;',
          'Constructs pipeline Head stage;',
          'Lazy: zero computation until terminal invocation;'
        ],
        pitfalls: [
          'Stream.generate() without a .limit(n) truncation is infinite and will run forever if passed to an eager collector like .toList().'
        ]
      },
      {
        name: 'Stateless Filtering & Drop (filter)',
        category: 'Deletion',
        signature: 'Stream<T> filter(Predicate<? super T> predicate) / Stream<T> distinct()',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1) aux for filter; O(n) for distinct',
        syntax: `List<String> valid = list.stream()
    .filter(Objects::nonNull) // Drops nulls
    .filter(s -> !s.isBlank()) // Drops blank strings
    .distinct() // Stateful deduplication
    .toList();`,
        internalWorking: 'filter(Predicate) wraps downstream Sink in Sink.ChainedReference. accept(u) checks predicate. If true, forwards to downstream.accept(u); if false, drops element immediately with zero buffer allocations.',
        mechanics: [
          'Constructs StatelessOp stage;',
          'Predicate evaluation decides whether to forward or discard element;',
          'Zero intermediate memory allocation;'
        ],
        pitfalls: [
          'filter() predicates MUST be pure functions without side-effects (modifying external shared state breaks thread safety).'
        ]
      },
      {
        name: 'Short-Circuit Search (findFirst / findAny)',
        category: 'Searching',
        signature: 'Optional<T> findFirst() / Optional<T> findAny()',
        timeComplexity: 'O(1) to O(n) (Short-Circuiting)',
        spaceComplexity: 'O(1)',
        syntax: `Optional<String> match = list.stream()
    .filter(s -> s.startsWith("AUTH_"))
    .findFirst(); // Preserves encounter order

Optional<String> fastMatch = list.parallelStream()
    .filter(s -> s.startsWith("AUTH_"))
    .findAny(); // Optimized for parallel throughput`,
        internalWorking: 'Short-circuiting terminal operation. Traverses elements until the first element reaches terminal sink. Sets cancellation flag cancellationRequested = true, terminating upstream Spliterator traversal immediately and returning result inside Optional<T>.',
        mechanics: [
          'Initializes FindOp terminal sink;',
          'Stops pipeline on first element satisfying upstream filters;',
          'Wraps result in Optional to eliminate NullPointerException risks;'
        ],
        pitfalls: [
          'In parallel streams, findFirst() forces thread synchronization to preserve encounter order, whereas findAny() allows the fastest worker thread to return.'
        ]
      },
      {
        name: 'Stateful Sorting Barrier (sorted)',
        category: 'Sorting',
        signature: 'Stream<T> sorted() / Stream<T> sorted(Comparator<? super T> comparator)',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n) auxiliary buffer',
        syntax: `// Natural ordering
List<Integer> sorted = numbers.stream().sorted().toList();

// Custom comparator
List<User> sortedUsers = users.stream()
    .sorted(Comparator.comparing(User::getScore).reversed())
    .toList();`,
        internalWorking: 'Stateful intermediate operation. Buffers all upstream elements into a temporary Object[] Sink array until end() signals upstream exhaustion, then calls Arrays.sort() and emits sorted items downstream.',
        mechanics: [
          'Acts as pipeline barrier (cannot stream elements forward until upstream finishes);',
          'Accumulates elements into internal Object[] sink buffer;',
          'Sorts via Dual-Pivot Timsort in O(n log n);',
          'Pushes sorted elements sequentially to downstream sink;'
        ],
        pitfalls: [
          'Calling .sorted() on an infinite stream causes an infinite loop and OutOfMemoryError because the barrier must accumulate all elements before emitting!'
        ]
      }
    ],
    scenarios: [
      { id: 1, domain: 'Financial Fraud Transaction Screener', problem: 'Filtering high-value transactions (> $10,000), verifying risk flags, and stopping at first suspicious transfer.', solution: 'Stream filter() paired with findFirst() short-circuits evaluation on first fraud match without scanning full dataset.' },
      { id: 2, domain: 'Distributed Server Log Aggregator', problem: 'Grouping 500,000 server error log entries by HTTP status code (404, 500, 503).', solution: 'logs.stream().collect(Collectors.groupingBy(Log::getStatus, Collectors.counting())) aggregates in one declarative pass.' },
      { id: 3, domain: 'E-Commerce Order Revenue Calculator', problem: 'Calculating total sum of completed purchases with discounts applied.', solution: 'orders.stream().filter(isCompleted).mapToDouble(Order::getTotal).sum() uses unboxed DoubleStream for zero GC.' },
      { id: 4, domain: 'Multi-Core CPU Data Processing', problem: 'Parsing 10,000,000 telemetry records across 16 CPU cores.', solution: 'records.parallelStream().map(Parser::parse).toList() partitions automatically across ForkJoinPool workers.' },
      { id: 5, domain: 'Autocomplete Search Query Top-K', problem: 'Selecting the top 5 highest-ranking search query suggestions.', solution: 'keywords.stream().filter(k -> k.startsWith(prefix)).sorted(byRank).limit(5).toList() extracts top-K items cleanly.' },
      { id: 6, domain: 'Database Entity DTO Projection', problem: 'Transforming database User entities into lightweight UserResponseDTO objects.', solution: 'users.stream().map(UserResponseDTO::fromEntity).toList() maps collections with zero mutable loop boilerplate.' },
      { id: 7, domain: 'Nested JSON Payload Flattener', problem: 'Flattening customer orders containing lists of order items into a single flat item stream.', solution: 'orders.stream().flatMap(o -> o.getItems().stream()).toList() flattens nested collections seamlessly.' },
      { id: 8, domain: 'Real-Time IoT Sensor Threshold Alert', problem: 'Checking if ANY temperature sensor in a factory exceeds 90 degrees Celsius.', solution: 'sensors.stream().anyMatch(s -> s.getTemp() > 90) evaluates lazily and aborts on first over-temp reading.' },
      { id: 9, domain: 'Microservice Health Check Aggregator', problem: 'Verifying that ALL registered microservice endpoints return HEALTHY status.', solution: 'services.stream().allMatch(Service::isHealthy) short-circuits to false if any single service is down.' },
      { id: 10, domain: 'CSV File Line Parser', problem: 'Streaming lines from a 50GB file without loading the full file into RAM.', solution: 'Files.lines(path).filter(line -> !line.startsWith("#")).map(Parser::parse) processes file stream line-by-line.' },
      { id: 11, domain: 'User Age Statistics Generator', problem: 'Computing average, min, max, and count of user ages in one scan.', solution: 'users.stream().mapToInt(User::getAge).summaryStatistics() computes all metrics in a single pass.' },
      { id: 12, domain: 'Multi-Tenant Invoice Partitioning', problem: 'Partitioning billing invoices into Paid vs Unpaid collections.', solution: 'invoices.stream().collect(Collectors.partitioningBy(Invoice::isPaid)) splits data into two lists in O(n).' },
      { id: 13, domain: 'Unique Customer Email Extractor', problem: 'Extracting distinct lowercase customer email addresses from multiple CRM lists.', solution: 'customers.stream().map(c -> c.getEmail().toLowerCase()).distinct().toList() deduplicates in pipeline.' },
      { id: 14, domain: 'Stock Market Daily Volume VWAP', problem: 'Computing Volume Weighted Average Price from thousands of trade events.', solution: 'trades.stream().reduce(new VWAPAccumulator(), VWAPAccumulator::combine) aggregates trade metrics.' },
      { id: 15, domain: 'API Request Parameter Validator', problem: 'Verifying that none of the incoming query parameters contain SQL injection strings.', solution: 'params.values().stream().noneMatch(SQLValidator::containsMaliciousChars) verifies payload safety.' },
      { id: 16, domain: 'Text Document Word Frequency Map', problem: 'Building a word frequency histogram from a body of text.', solution: 'words.stream().collect(Collectors.groupingBy(w -> w, Collectors.counting())) constructs histogram in O(n).' },
      { id: 17, domain: 'Batch Payment Gateway Dispatcher', problem: 'Splitting payment batches into chunks of 100 for batch API submission.', solution: 'Custom Spliterator or Stream.iterate batches records cleanly for batch processing.' },
      { id: 18, domain: 'Flight Ticket Route Comparator', problem: 'Finding the cheapest non-stop flight ticket between two airport codes.', solution: 'flights.stream().filter(Flight::isNonStop).min(Comparator.comparing(Flight::getPrice)) finds minimum.' },
      { id: 19, domain: 'Shopping Cart Tax Applicator', problem: 'Applying state sales tax to taxable cart items and summing invoice total.', solution: 'cart.stream().filter(Item::isTaxable).mapToDouble(i -> i.getPrice() * taxRate).sum() calculates tax.' },
      { id: 20, domain: 'Infinite Unique ID Generator', problem: 'Generating infinite sequence of unique UUID tokens for test fixtures.', solution: 'Stream.generate(UUID::randomUUID).limit(1000).toList() evaluates infinite streams on-demand.' }
    ],
    interviewQAs: [
      { id: 1, category: 'Service-Based', question: 'What is the core difference between Java Collections and Java Streams?', answer: 'Collections are in-memory data structures storing elements eagerly. Streams do not store data; they are computational pipelines that process elements from a source lazily and can only be consumed once.' },
      { id: 2, category: 'Service-Based', question: 'What is the difference between Intermediate and Terminal operations in Streams?', answer: 'Intermediate operations (filter, map, sorted) return a new lazy Stream and do not execute until a terminal operation is called. Terminal operations (collect, count, forEach, findFirst) trigger single-pass evaluation and close the stream.' },
      { id: 3, category: 'Service-Based', question: 'What happens if you try to reuse a Java Stream after invoking a terminal operation?', answer: 'Invoking any operation on an already consumed or closed Stream throws an IllegalStateException: stream has already been operated upon or closed.' },
      { id: 4, category: 'Service-Based', question: 'Explain lazy evaluation in Java Streams and its performance benefits.', answer: 'Intermediate operations are not executed when defined. Computation only starts when a terminal operation is called, allowing the stream engine to fuse operations (loop fusion) and short-circuit early (e.g. stopping after findFirst), avoiding processing unused elements.' },
      { id: 5, category: 'Service-Based', question: 'What is the difference between map() and flatMap()?', answer: 'map(Function<T, R>) produces a one-to-one transformation (T -> R). flatMap(Function<T, Stream<R>>) produces a one-to-many transformation, flattening nested streams (e.g. Stream<List<String>> -> Stream<String>).' },
      { id: 6, category: 'Service-Based', question: 'What is the difference between findFirst() and findAny()?', answer: 'findFirst() returns the first element in encounter order (strictly deterministic). findAny() returns any element matching conditions, which is optimized for maximum throughput in parallel streams.' },
      { id: 7, category: 'Service-Based', question: 'What is the difference between forEach() and forEachOrdered()?', answer: 'In parallel streams, forEach() executes actions on elements in non-deterministic thread completion order. forEachOrdered() guarantees execution in the stream encounter order, sacrificing some parallel concurrency.' },
      { id: 8, category: 'Service-Based', question: 'Why should you prefer primitive streams (IntStream, LongStream) over Stream<Integer>?', answer: 'Primitive streams avoid boxing and unboxing overhead (converting primitive int to Integer object), reducing heap memory allocations, GC churn, and cache misses.' },
      { id: 9, category: 'Service-Based', question: 'What is the purpose of Collectors.groupingBy()?', answer: 'groupingBy() is a collector that organizes stream elements into a Map<K, List<T>> based on a classification function, similar to SQL GROUP BY.' },
      { id: 10, category: 'Service-Based', question: 'What is peek() intended for in Java Streams?', answer: 'peek(Consumer) is intended exclusively for debugging pipeline flow (e.g. printing intermediate states) without modifying elements. It should not be used to perform business side-effects.' },
      { id: 11, category: 'Product-Based', question: 'Explain the internal architecture of Stream execution: PipelineHelper, Sink, and ReferencePipeline.', answer: 'A Stream is represented as a doubly-linked chain of ReferencePipeline stages (Head -> Intermediate -> Terminal). When a terminal operation runs, PipelineHelper wraps the terminal Sink inside upstream intermediate Sinks (forming a nested chain of accept() calls). Elements flow through this fused Sink chain one-by-one in a single pass.' },
      { id: 12, category: 'Product-Based', question: 'How does Spliterator enable parallel stream decomposition via trySplit() and ForkJoinPool?', answer: 'Spliterator defines trySplit(). If a source supports balanced splitting (like ArrayList), trySplit() divides the index range in O(1) time. ForkJoinPool recursively spawns ForkJoinTasks for each spliterator chunk, executing work across worker threads and combining results via work-stealing algorithms.' },
      { id: 13, category: 'Product-Based', question: 'What is the danger of using parallelStream() in standard enterprise Spring Boot web applications?', answer: 'All parallelStream() executions across the entire JVM share the single common ForkJoinPool (ForkJoinPool.commonPool()). A blocking I/O call (HTTP, DB) inside one parallel stream can saturate common pool worker threads, starving unrelated requests across the entire application.' },
      { id: 14, category: 'Product-Based', question: 'Explain the difference between Stateless (filter, map) and Stateful (sorted, distinct) intermediate operations.', answer: 'Stateless operations process each element independently without retaining past state. Stateful operations (like sorted() or distinct()) act as pipeline barriers; sorted() must buffer ALL upstream elements into memory before emitting the first sorted element downstream.' },
      { id: 15, category: 'Product-Based', question: 'How does stream short-circuiting work internally with Sink.cancellationRequested()?', answer: 'Terminal operations like findFirst or anyMatch implement Sink.cancellationRequested(). After finding a match, cancellationRequested() returns true. The upstream Spliterator loop checks this flag and breaks early, terminating upstream iteration without processing remaining elements.' },
      { id: 16, category: 'Product-Based', question: 'Why is a traditional for-loop faster than a Stream for small collections (e.g. 10 elements)?', answer: 'Streams incur setup costs: pipeline stage objects, Sink chain instantiations, lambda capture allocations, and dynamic dispatch overhead. For small arrays, this fixed overhead outweighs loop execution time, whereas JIT optimizes raw for-loops into tight machine code.' },
      { id: 17, category: 'Product-Based', question: 'Explain the characteristics flags in Spliterator (SIZED, DISTINCT, SORTED, ORDERED, NONNULL, IMMUTABLE, CONCURRENT, SUBSIZED).', answer: 'Characteristics inform the stream engine of source properties. For example, if a Spliterator is SORTED, stream.sorted() becomes a no-op and bypasses sorting buffers. If SIZED, collectors pre-allocate exact capacity arrays.' },
      { id: 18, category: 'Product-Based', question: 'What are the 3 arguments to Stream.reduce(identity, accumulator, combiner) and why is combiner needed?', answer: '1. Identity: initial seed value. 2. Accumulator: BiFunction combining partial result with element. 3. Combiner: BinaryOperator merging two partial results produced by independent parallel threads in ForkJoinPool.' },
      { id: 19, category: 'Product-Based', question: 'How does Stream.toList() introduced in Java 16 differ from Collectors.toList()?', answer: 'Stream.toList() returns an unmodifiable, compact List implementation optimized by the JVM that permits nulls and uses less memory. Collectors.toList() returns a mutable ArrayList with no immutability guarantees.' },
      { id: 20, category: 'Product-Based', question: 'How can you run a parallelStream on a custom dedicated ForkJoinPool instead of the common pool?', answer: 'Execute the stream inside a custom pool: customPool.submit(() -> list.parallelStream().map(...).toList()).get(). The stream tasks will execute on the custom pool worker threads instead of ForkJoinPool.commonPool().' }
    ],
    quizzes: [
      { id: 1, difficulty: 'Easy', question: 'Do Java Streams modify the underlying source collection during transformation?', options: ['A) Yes, mutations occur in-place', 'B) No, Streams are pure functional pipelines that leave sources unmodified', 'C) Only when sorted() is called', 'D) Only in parallel mode'], correctOption: 'B', explanation: 'Streams do not mutate their source data; they produce new result streams or collections.' },
      { id: 2, difficulty: 'Easy', question: 'Which of the following is a Terminal operation in Java Streams?', options: ['A) filter()', 'B) map()', 'C) collect()', 'D) sorted()'], correctOption: 'C', explanation: 'collect() is a terminal operation that triggers evaluation and gathers results.' },
      { id: 3, difficulty: 'Easy', question: 'What happens if you invoke a terminal operation on a Stream that has already been consumed?', options: ['A) Re-executes from source', 'B) Throws IllegalStateException', 'C) Returns an empty collection', 'D) Resets pipeline'], correctOption: 'B', explanation: 'Streams are single-use; re-invoking throws IllegalStateException.' },
      { id: 4, difficulty: 'Easy', question: 'Which method transforms a nested Stream<List<String>> into a flat Stream<String>?', options: ['A) map()', 'B) flatMap()', 'C) flatten()', 'D) merge()'], correctOption: 'B', explanation: 'flatMap() flattens nested streams into a single continuous element stream.' },
      { id: 5, difficulty: 'Easy', question: 'Which operation short-circuits evaluation as soon as ANY element matches the condition?', options: ['A) allMatch()', 'B) anyMatch()', 'C) noneMatch()', 'D) filter()'], correctOption: 'B', explanation: 'anyMatch() stops scanning and returns true upon finding the first match.' },
      { id: 6, difficulty: 'Easy', question: 'Which primitive stream should you use to sum an array of int numbers without boxing overhead?', options: ['A) Stream<Integer>', 'B) IntStream', 'C) NumberStream', 'D) PrimitiveStream'], correctOption: 'B', explanation: 'IntStream processes unboxed 32-bit primitive integers with zero GC overhead.' },
      { id: 7, difficulty: 'Easy', question: 'Which method creates an unmodifiable List directly from a Stream in Java 16+?', options: ['A) .toList()', 'B) .toImmutableList()', 'C) .collectList()', 'D) .asUnmodifiable()'], correctOption: 'A', explanation: 'Java 16 added stream.toList() which returns an unmodifiable list directly.' },
      { id: 8, difficulty: 'Medium', question: 'Why is sorted() considered a "Stateful Barrier" intermediate operation in Streams?', options: ['A) It requires thread locking', 'B) It must buffer all upstream elements in memory before emitting the first sorted element', 'C) It mutates the source array', 'D) It cancels the stream'], correctOption: 'B', explanation: 'A sort cannot emit any element until it has received and compared all upstream elements.' },
      { id: 9, difficulty: 'Medium', question: 'What thread pool is used by default when executing collection.parallelStream()?', options: ['A) Executors.newFixedThreadPool()', 'B) ForkJoinPool.commonPool()', 'C) ThreadPoolExecutor', 'D) Dedicated per-collection pool'], correctOption: 'B', explanation: 'Parallel streams share the JVM-wide ForkJoinPool.commonPool().' },
      { id: 10, difficulty: 'Medium', question: 'What is the difference between findFirst() and findAny() in parallel streams?', options: ['A) No difference', 'B) findFirst preserves encounter order; findAny returns whichever thread finishes first', 'C) findAny is deterministic', 'D) findFirst runs in single thread only'], correctOption: 'B', explanation: 'findAny is non-deterministic and optimized for maximum parallel throughput.' },
      { id: 11, difficulty: 'Medium', question: 'What is the purpose of the Spliterator interface in Java 8?', options: ['A) Splits strings by delimiter', 'B) Traverses and partitions stream sources for parallel processing', 'C) Clones collections', 'D) Formats console output'], correctOption: 'B', explanation: 'Spliterator handles iteration and recursive partitioning (trySplit) for streams.' },
      { id: 12, difficulty: 'Medium', question: 'What collector groups elements into a Map based on a boolean predicate (e.g. pass/fail)?', options: ['A) Collectors.groupingBy()', 'B) Collectors.partitioningBy()', 'C) Collectors.toMap()', 'D) Collectors.split()'], correctOption: 'B', explanation: 'partitioningBy(Predicate) partitions elements into true and false lists.' },
      { id: 13, difficulty: 'Medium', question: 'What is the risk of performing blocking I/O (e.g. HTTP calls) inside a parallelStream()?', options: ['A) Throws IOException', 'B) Starves the shared ForkJoinPool.commonPool(), blocking other tasks across the application', 'C) Memory leak', 'D) CPU overheating'], correctOption: 'B', explanation: 'Blocking common pool threads starves all parallel streams across the JVM.' },
      { id: 14, difficulty: 'Medium', question: 'What does Stream.generate(Supplier) produce?', options: ['A) Fixed 10-element stream', 'B) An infinite unordered stream where each element is generated by the supplier', 'C) Throws UnsupportedOperationException', 'D) Random integers only'], correctOption: 'B', explanation: 'Stream.generate() produces an infinite stream evaluated lazily.' },
      { id: 15, difficulty: 'Hard', question: 'How does Stream Loop Fusion work internally in the OpenJDK ReferencePipeline?', options: ['A) Compiles bytecodes to C++', 'B) Chains multiple Sink.accept() calls inside a single iteration pass over source elements', 'C) Creates temporary arrays for each intermediate step', 'D) Uses multi-threading on single core'], correctOption: 'B', explanation: 'Loop fusion evaluates chained operations element-by-element in a single iteration pass.' },
      { id: 16, difficulty: 'Hard', question: 'What is the purpose of the combiner argument in Stream.reduce(identity, accumulator, combiner)?', options: ['A) Error recovery', 'B) Combines partial reduction results produced by separate parallel worker threads', 'C) Sorts reduction output', 'D) Validates null values'], correctOption: 'B', explanation: 'The combiner merges intermediate results from parallel thread sub-tasks.' },
      { id: 17, difficulty: 'Hard', question: 'If a Spliterator has the SORTED characteristic, what does stream.sorted() do?', options: ['A) Re-sorts the stream', 'B) Acts as a no-op and bypasses the stateful sorting barrier completely', 'C) Throws IllegalStateException', 'D) Reverses order'], correctOption: 'B', explanation: 'The pipeline detects the SORTED flag and bypasses sorting buffering.' },
      { id: 18, difficulty: 'Hard', question: 'Why is list.stream().filter(p).limit(1).findFirst() more efficient than list.stream().filter(p).findFirst()?', options: ['A) It is identical; findFirst already short-circuits on first element', 'B) limit(1) uses less memory', 'C) findFirst alone is eager', 'D) limit enables parallelism'], correctOption: 'A', explanation: 'findFirst is already an intrinsic short-circuiting operation.' },
      { id: 19, difficulty: 'Hard', question: 'What happens if a Stream pipeline encounters an unhandled exception inside a map() lambda?', options: ['A) Skips the element silently', 'B) Pipeline immediately aborts and propagates the exception to the caller', 'C) Retries 3 times', 'D) Collects into error stream'], correctOption: 'B', explanation: 'Runtime exceptions immediately terminate stream execution and bubble up.' },
      { id: 20, difficulty: 'Hard', question: 'How does Stream.of("A", "B").parallel().unordered().distinct() optimize distinct processing?', options: ['A) Skips hashing', 'B) Removes encounter order constraint, allowing threads to deduplicate locally via ConcurrentHashMap', 'C) Uses bloom filter', 'D) Clones stream'], correctOption: 'B', explanation: 'Unordered streams allow concurrent parallel deduplication without ordering synchronization.' }
    ]
  }
};

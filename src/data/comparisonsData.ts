export interface MatrixRow {
  collection: string;
  category: string;
  backingStructure: string;
  readComplexity: string;
  insertComplexity: string;
  deleteComplexity: string;
  nullPolicy: string;
  ordering: string;
  threadSafe: string;
  bestUseCase: string;
}

export interface FaceOffSection {
  id: string;
  title: string;
  subtitle: string;
  features: {
    feature: string;
    colA: string;
    colB: string;
    colC?: string;
    verdict: string;
  }[];
  verdictSummary: string;
}

export interface DecisionNode {
  id: string;
  question: string;
  description: string;
  options: {
    label: string;
    detail: string;
    nextId?: string;
    recommendation?: {
      name: string;
      category: string;
      reason: string;
      pros: string[];
      codeSample: string;
    };
  }[];
}

export const MASTER_MATRIX: MatrixRow[] = [
  {
    collection: 'ArrayList',
    category: 'List',
    backingStructure: 'Resizable Object[] Array',
    readComplexity: 'O(1) Direct Offset',
    insertComplexity: 'Amortized O(1) / O(n) pos',
    deleteComplexity: 'O(n) Array Shift',
    nullPolicy: 'Permitted (Multiple)',
    ordering: 'Insertion Order (Indexed)',
    threadSafe: 'No (Unsynchronized)',
    bestUseCase: 'Read-heavy workloads, random indexed access, bulk batch ingestion.'
  },
  {
    collection: 'LinkedList',
    category: 'List / Deque',
    backingStructure: 'Doubly-Linked Node<E>',
    readComplexity: 'O(n) Pointer Traversal',
    insertComplexity: 'O(1) Endpoints / O(n) mid',
    deleteComplexity: 'O(1) Endpoints / O(n) mid',
    nullPolicy: 'Permitted (Multiple)',
    ordering: 'Insertion Order (Bidirectional)',
    threadSafe: 'No (Unsynchronized)',
    bestUseCase: 'FIFO Queues, LIFO Stacks, endpoint-only inserts/removals.'
  },
  {
    collection: 'ArrayDeque',
    category: 'Deque / Queue',
    backingStructure: 'Circular Resizable Array',
    readComplexity: 'O(1) Endpoints',
    insertComplexity: 'Amortized O(1) Endpoints',
    deleteComplexity: 'O(1) Endpoints',
    nullPolicy: 'Disallowed (Throws NPE)',
    ordering: 'FIFO / LIFO',
    threadSafe: 'No (Unsynchronized)',
    bestUseCase: 'High-performance Stack/Queue with zero GC node churn (faster than LinkedList).'
  },
  {
    collection: 'HashSet',
    category: 'Set',
    backingStructure: 'HashMap (Hash Table + RB-Tree)',
    readComplexity: 'O(1) Avg (Hash lookup)',
    insertComplexity: 'O(1) Avg / O(log n) worst',
    deleteComplexity: 'O(1) Avg / O(log n) worst',
    nullPolicy: 'Permitted (1 Null)',
    ordering: 'Unordered (Non-deterministic)',
    threadSafe: 'No (Unsynchronized)',
    bestUseCase: 'Fast constant-time deduplication and instant membership checks.'
  },
  {
    collection: 'LinkedHashSet',
    category: 'Set',
    backingStructure: 'HashMap + Doubly-Linked Chain',
    readComplexity: 'O(1) Avg',
    insertComplexity: 'O(1) Avg',
    deleteComplexity: 'O(1) Avg',
    nullPolicy: 'Permitted (1 Null)',
    ordering: 'Insertion Order Preserved',
    threadSafe: 'No (Unsynchronized)',
    bestUseCase: 'Deduplication where predictable iteration order is required.'
  },
  {
    collection: 'TreeSet',
    category: 'Set / NavigableSet',
    backingStructure: 'TreeMap (Red-Black BST)',
    readComplexity: 'Guaranteed O(log n)',
    insertComplexity: 'Guaranteed O(log n)',
    deleteComplexity: 'Guaranteed O(log n)',
    nullPolicy: 'Disallowed (Throws NPE)',
    ordering: 'Sorted (Comparable / Comparator)',
    threadSafe: 'No (Unsynchronized)',
    bestUseCase: 'Continuous sorting, range queries (subSet), boundary search (floor/ceiling).'
  },
  {
    collection: 'HashMap',
    category: 'Map',
    backingStructure: 'Node<K,V>[] Buckets + RB-Tree',
    readComplexity: 'O(1) Avg / O(log n) worst',
    insertComplexity: 'O(1) Avg / O(log n) worst',
    deleteComplexity: 'O(1) Avg / O(log n) worst',
    nullPolicy: '1 Null Key, Multiple Null Values',
    ordering: 'Unordered',
    threadSafe: 'No (Unsynchronized)',
    bestUseCase: 'High-speed associative key-value caching, fast in-memory dictionaries.'
  },
  {
    collection: 'LinkedHashMap',
    category: 'Map',
    backingStructure: 'HashMap + Doubly-Linked Chain',
    readComplexity: 'O(1) Avg',
    insertComplexity: 'O(1) Avg',
    deleteComplexity: 'O(1) Avg',
    nullPolicy: '1 Null Key, Multiple Null Values',
    ordering: 'Insertion or Access Order (LRU)',
    threadSafe: 'No (Unsynchronized)',
    bestUseCase: 'Building bounded Least Recently Used (LRU) memory caches.'
  },
  {
    collection: 'TreeMap',
    category: 'Map / NavigableMap',
    backingStructure: 'Red-Black Self-Balancing BST',
    readComplexity: 'Guaranteed O(log n)',
    insertComplexity: 'Guaranteed O(log n)',
    deleteComplexity: 'Guaranteed O(log n)',
    nullPolicy: 'No Null Keys (Throws NPE)',
    ordering: 'Sorted Keys (Natural/Comparator)',
    threadSafe: 'No (Unsynchronized)',
    bestUseCase: 'Key-sorted data, dynamic range lookups, prefix/ceiling map queries.'
  },
  {
    collection: 'ConcurrentHashMap',
    category: 'Map (Concurrent)',
    backingStructure: 'CAS + Synchronized Node Bins',
    readComplexity: 'Lock-Free O(1) Avg',
    insertComplexity: 'O(1) Avg (Bucket Lock)',
    deleteComplexity: 'O(1) Avg (Bucket Lock)',
    nullPolicy: 'Disallows ALL Nulls',
    ordering: 'Unordered',
    threadSafe: 'Yes (High Scalability)',
    bestUseCase: 'High-throughput multi-threaded concurrent web applications and shared caches.'
  },
  {
    collection: 'Java Streams',
    category: 'Stream Pipeline',
    backingStructure: 'Spliterator + ReferencePipeline',
    readComplexity: 'O(n) Lazy Evaluation',
    insertComplexity: 'N/A (Functional Flow)',
    deleteComplexity: 'N/A (Functional Flow)',
    nullPolicy: 'Permitted (Handled via Filter)',
    ordering: 'Preserves Source Encounter Order',
    threadSafe: 'Parallel via ForkJoinPool',
    bestUseCase: 'Declarative transformations, multi-stage map-reduce, multi-core analytics.'
  }
];

export const FACE_OFFS: FaceOffSection[] = [
  {
    id: 'arraylist-vs-linkedlist',
    title: 'ArrayList vs LinkedList',
    subtitle: 'Contiguous Array vs Scattered Doubly-Linked Node Pointers',
    features: [
      {
        feature: 'Internal Backing Structure',
        colA: 'Contiguous Object[] elementData array',
        colB: 'Doubly-linked Node<E> (prev, item, next) on heap',
        verdict: 'ArrayList provides contiguous memory layout; LinkedList scatters objects.'
      },
      {
        feature: 'Positional Read: get(i)',
        colA: 'O(1) Direct Base + (i * 4) address offset',
        colB: 'O(n) Pointer traversal (up to n/2 node dereferences)',
        verdict: 'ArrayList is 50x-100x faster for indexed reads.'
      },
      {
        feature: 'Head Insert / Delete',
        colA: 'O(n) Requires System.arraycopy memory shift',
        colB: 'O(1) linkFirst / unlinkFirst pointer rewire',
        verdict: 'LinkedList is faster for frequent head insertions.'
      },
      {
        feature: 'Tail Insert (Append)',
        colA: 'Amortized O(1) (Fast memory write)',
        colB: 'O(1) (Requires new Node instantiation)',
        verdict: 'ArrayList append is faster and avoids GC pressure.'
      },
      {
        feature: 'CPU Hardware Cache Locality',
        colA: 'Superior: Prefetches 16 elements per 64-byte L1 cache line',
        colB: 'Poor: Pointer chasing causes frequent DRAM cache misses',
        verdict: 'ArrayList iteration outperforms LinkedList by 15x-20x on modern CPUs.'
      },
      {
        feature: 'Memory Overhead per Element',
        colA: '4 bytes (CompressedOOP reference pointer)',
        colB: '24 bytes (12B header + 3x4B references)',
        verdict: 'LinkedList consumes 6x more heap memory per element.'
      },
      {
        feature: 'Recommendation',
        colA: 'Default choice for 95% of use cases',
        colB: 'Rarely recommended; use ArrayDeque for Stacks/Queues instead',
        verdict: 'ArrayList wins decisively for almost all practical workloads.'
      }
    ],
    verdictSummary: 'ArrayList is the undisputed king for in-memory collections due to modern CPU cache line prefetching, compact memory footprint, and O(1) random access. For Queue/Deque workloads, prefer ArrayDeque over LinkedList.'
  },
  {
    id: 'hashset-vs-treeset',
    title: 'HashSet vs TreeSet',
    subtitle: 'Hash Bucketing vs Red-Black Self-Balancing Binary Search Tree',
    features: [
      {
        feature: 'Underlying Engine',
        colA: 'HashMap (Dynamic table array + separate chaining)',
        colB: 'TreeMap (Red-Black Self-Balancing BST)',
        verdict: 'HashSet uses hash bucketing; TreeSet uses balanced tree pointers.'
      },
      {
        feature: 'Lookup & Mutation Complexity',
        colA: 'O(1) Average time complexity',
        colB: 'Guaranteed O(log n) time complexity',
        verdict: 'HashSet is faster for single-key operations; TreeSet guarantees logarithmic bounds.'
      },
      {
        feature: 'Ordering Guarantee',
        colA: 'None (Non-deterministic, shifts on resize)',
        colB: 'Continuously Sorted (Natural or Comparator)',
        verdict: 'TreeSet guarantees sorted order at all times.'
      },
      {
        feature: 'Null Element Policy',
        colA: 'Allows 1 null element (in bucket 0)',
        colB: 'Disallows null (throws NullPointerException)',
        verdict: 'TreeSet strictly rejects nulls due to comparison requirements.'
      },
      {
        feature: 'Uniqueness Contract',
        colA: 'hashCode() followed by equals()',
        colB: 'compareTo() or compare() == 0 exclusively',
        verdict: 'TreeSet ignores equals() and relies solely on compareTo().'
      },
      {
        feature: 'Range & Boundary Queries',
        colA: 'Not Supported (Requires full scan)',
        colB: 'Native: floor(), ceiling(), lower(), higher(), subSet()',
        verdict: 'TreeSet excels at dynamic range slicing.'
      }
    ],
    verdictSummary: 'Choose HashSet when you need maximum raw throughput for uniqueness checking and membership queries in O(1). Choose TreeSet when you need continuous sorted order, nearest-neighbor searches, or range queries in O(log n).'
  },
  {
    id: 'hashmap-vs-treemap-vs-concurrenthashmap',
    title: 'HashMap vs TreeMap vs ConcurrentHashMap',
    subtitle: 'Single-Threaded Hashing vs Sorted Keys vs Lock-Free Concurrency',
    features: [
      {
        feature: 'Underlying Engine',
        colA: 'Node<K,V>[] + Red-Black Trees',
        colB: 'Red-Black BST (Entry<K,V>)',
        colC: 'CAS + Synchronized Node Bins',
        verdict: 'Different architectures tailored for speed, ordering, and concurrency.'
      },
      {
        feature: 'Time Complexity',
        colA: 'O(1) Average',
        colB: 'Guaranteed O(log n)',
        colC: 'O(1) Average',
        verdict: 'HashMap and ConcurrentHashMap offer O(1); TreeMap offers O(log n).'
      },
      {
        feature: 'Thread Safety',
        colA: 'No (Fail-Fast, throws CME)',
        colB: 'No (Fail-Fast, throws CME)',
        colC: 'Yes (Lock-free reads, bin write locks)',
        verdict: 'ConcurrentHashMap is safe for massive multithreading without global locking.'
      },
      {
        feature: 'Null Keys & Values',
        colA: '1 Null Key, Any Null Values',
        colB: 'No Null Keys, Any Null Values',
        colC: 'Rejects ALL Null Keys and Values',
        verdict: 'ConcurrentHashMap forbids nulls to avoid ambiguity in get() vs containsKey().'
      },
      {
        feature: 'Key Ordering',
        colA: 'Unordered',
        colB: 'Sorted In-Order (Comparator)',
        colC: 'Unordered',
        verdict: 'TreeMap is the only one maintaining key order.'
      },
      {
        feature: 'Concurrent Mutation',
        colA: 'Corrupts pointers / Throws CME',
        colB: 'Corrupts tree / Throws CME',
        colC: 'Weakly consistent (Never throws CME)',
        verdict: 'ConcurrentHashMap handles concurrent writes gracefully.'
      }
    ],
    verdictSummary: 'Use HashMap for standard single-threaded associative caching. Use TreeMap when keys must remain sorted or when executing boundary searches. Use ConcurrentHashMap for multi-threaded high-throughput enterprise systems.'
  },
  {
    id: 'collections-vs-streams',
    title: 'Java Collections vs Java Streams',
    subtitle: 'In-Memory Data Storage vs Lazy Functional Pipeline Computation',
    features: [
      {
        feature: 'Primary Purpose',
        colA: 'In-memory data structure for storing elements',
        colB: 'Declarative functional computational pipeline',
        verdict: 'Collections hold state; Streams transform data.'
      },
      {
        feature: 'Evaluation Strategy',
        colA: 'Eager: Allocates and populates immediately',
        colB: 'Lazy: Executes only upon terminal operation invocation',
        verdict: 'Streams avoid unnecessary computation via short-circuiting.'
      },
      {
        feature: 'Reusability',
        colA: 'Reusable infinite times',
        colB: 'Single-Use: Cannot be operated upon once consumed',
        verdict: 'Streams throw IllegalStateException if re-invoked.'
      },
      {
        feature: 'Data Mutation',
        colA: 'In-place state mutation (add, remove, clear)',
        colB: 'Pure immutable transformations (leaves source untouched)',
        verdict: 'Streams preserve immutability and eliminate side-effects.'
      },
      {
        feature: 'Iteration Model',
        colA: 'External Iteration: for-loops, while-loops',
        colB: 'Internal Iteration: forEach, collect, loop fusion',
        verdict: 'Streams handle iteration internally and optimize pipeline execution.'
      },
      {
        feature: 'Parallelism Mechanism',
        colA: 'Manual thread pools, Locks, Concurrent queues',
        colB: 'Declarative: .parallelStream() via ForkJoinPool',
        verdict: 'Streams make multi-core parallelization effortless.'
      }
    ],
    verdictSummary: 'Collections and Streams are complementary: Collections store and organize data in heap memory; Streams provide declarative, lazy, and parallel pipelines to process, filter, and transform that data.'
  }
];

export const DECISION_TREE: Record<string, DecisionNode> = {
  start: {
    id: 'start',
    question: 'What is the primary format of your data?',
    description: 'Determine whether you are storing individual items, key-value mappings, or processing streaming flows.',
    options: [
      { label: 'Individual Elements (Values Only)', detail: 'Lists, Sets, Queues of single objects', nextId: 'elements_flow' },
      { label: 'Key-Value Pairs (Associations)', detail: 'Associating unique keys with values', nextId: 'maps_flow' },
      { label: 'Streaming / Data Transformation Pipeline', detail: 'Transforming, filtering, or aggregating existing data', nextId: 'streams_flow' }
    ]
  },
  elements_flow: {
    id: 'elements_flow',
    question: 'Do you need to store DUPLICATE elements or maintain STRICT INDEXED access?',
    description: 'Decide if elements must be unique or if positional indices and duplicates are allowed.',
    options: [
      { label: 'Duplicates Allowed / Positional Index Access', detail: 'Access elements by index 0, 1, 2... and permit duplicate entries', nextId: 'list_flow' },
      { label: 'Unique Elements Only (No Duplicates)', detail: 'Deduplicate data and reject duplicates automatically', nextId: 'set_flow' },
      { label: 'FIFO Queue or LIFO Stack Access', detail: 'Process elements in arrival order or stack push/pop order', nextId: 'queue_flow' }
    ]
  },
  list_flow: {
    id: 'list_flow',
    question: 'How do you access and modify this list most frequently?',
    description: 'Examine whether your workload is read-heavy or heavily modifies endpoints.',
    options: [
      {
        label: 'Read-Heavy, Random Positional Reads, Bulk Appends',
        detail: 'Lookups by index get(i), iterating sequentially, or appending to the end',
        recommendation: {
          name: 'ArrayList',
          category: 'List',
          reason: 'ArrayList provides blazing fast O(1) index access, compact memory footprint (4B/ref), and superior CPU L1/L2 cache locality.',
          pros: ['O(1) direct offset reads', 'Dense memory layout', 'Optimized JIT vectorization'],
          codeSample: 'List<String> list = new ArrayList<>(1000);\nlist.add("Data");\nString val = list.get(0);'
        }
      },
      {
        label: 'Thread-Safe Concurrent Reads with Rare Writes',
        detail: '99% read operations across multiple threads with rare modifications',
        recommendation: {
          name: 'CopyOnWriteArrayList',
          category: 'Concurrent List',
          reason: 'CopyOnWriteArrayList provides 100% lock-free reads without locking or ConcurrentModificationException.',
          pros: ['Lock-free volatile reads', 'Snapshot iterator isolation', 'Zero CME exceptions'],
          codeSample: 'List<String> list = new CopyOnWriteArrayList<>();\nlist.add("ThreadSafe");'
        }
      }
    ]
  },
  set_flow: {
    id: 'set_flow',
    question: 'Do elements need to be CONTINUOUSLY SORTED or maintain insertion order?',
    description: 'Evaluate ordering requirements for your unique set.',
    options: [
      {
        label: 'No Ordering Needed (Maximum Raw Speed)',
        detail: 'Fastest O(1) average add, remove, and contains operations',
        recommendation: {
          name: 'HashSet',
          category: 'Set',
          reason: 'HashSet delivers O(1) average constant-time performance for deduplication and membership queries.',
          pros: ['O(1) average lookup/insert', 'Automatic duplicate rejection', 'Permits 1 null element'],
          codeSample: 'Set<String> set = new HashSet<>(32);\nset.add("UNIQUE_TOKEN");\nboolean has = set.contains("UNIQUE_TOKEN");'
        }
      },
      {
        label: 'Preserve Original Insertion Order',
        detail: 'Iterate elements in the exact order they were inserted',
        recommendation: {
          name: 'LinkedHashSet',
          category: 'Set',
          reason: 'LinkedHashSet combines hash table O(1) speed with a doubly-linked iteration list to guarantee insertion order.',
          pros: ['O(1) lookup', 'Predictable iteration order', 'Fast set diffing'],
          codeSample: 'Set<String> set = new LinkedHashSet<>();\nset.add("First");\nset.add("Second");'
        }
      },
      {
        label: 'Continuously Sorted / Range & Boundary Searches',
        detail: 'Keep elements in natural/comparator order and execute floor(), ceiling(), subSet() queries',
        recommendation: {
          name: 'TreeSet',
          category: 'NavigableSet',
          reason: 'TreeSet provides guaranteed O(log n) time boundaries backed by a Red-Black BST, supporting rich boundary and range search queries.',
          pros: ['Continuous sorting', 'floor()/ceiling() range search', 'Deterministic O(log n) performance'],
          codeSample: 'NavigableSet<Integer> tree = new TreeSet<>();\ntree.add(50);\nint closest = tree.floor(45);'
        }
      }
    ]
  },
  queue_flow: {
    id: 'queue_flow',
    question: 'What type of Queue or Stack behavior do you require?',
    description: 'Select between standard FIFO/LIFO processing vs Priority-based sorting.',
    options: [
      {
        label: 'Standard FIFO Queue or LIFO Stack (High Performance)',
        detail: 'Enqueue at tail, dequeue from head, or push/pop from top',
        recommendation: {
          name: 'ArrayDeque',
          category: 'Deque / Queue',
          reason: 'ArrayDeque is backed by a circular resizable array with zero node allocation overhead and superior cache locality, outperforming LinkedList.',
          pros: ['Zero GC node churn', 'Amortized O(1) endpoint ops', 'Faster than LinkedList and Stack'],
          codeSample: 'Deque<String> queue = new ArrayDeque<>(64);\nqueue.offer("Job-1");\nString job = queue.poll();'
        }
      },
      {
        label: 'Priority-Based Ordering (Min-Heap / Max-Heap)',
        detail: 'Poll elements based on priority/comparator order rather than arrival time',
        recommendation: {
          name: 'PriorityQueue',
          category: 'Queue (Heap)',
          reason: 'PriorityQueue is backed by a binary min-heap array, providing O(log n) insertion/polling of highest-priority items.',
          pros: ['O(1) peek at highest priority', 'O(log n) offer/poll', 'Custom comparator support'],
          codeSample: 'Queue<Task> pq = new PriorityQueue<>(Comparator.comparing(Task::getPriority));\npq.offer(new Task(1));'
        }
      }
    ]
  },
  maps_flow: {
    id: 'maps_flow',
    question: 'What are your Thread-Safety and Ordering requirements for the Key-Value Map?',
    description: 'Select between standard single-threaded map, sorted keys, LRU caching, or concurrent multi-threading.',
    options: [
      {
        label: 'Single-Threaded Maximum Throughput (No Ordering)',
        detail: 'Fastest O(1) key-value lookup and put in single thread',
        recommendation: {
          name: 'HashMap',
          category: 'Map',
          reason: 'HashMap provides O(1) average lookup/put with Red-Black treeification fallback, ideal for general-purpose associative caching.',
          pros: ['O(1) average lookup', 'Treeification protects from collisions', 'Permits 1 null key'],
          codeSample: 'Map<String, Integer> map = new HashMap<>(32);\nmap.put("CPU", 80);\nint v = map.getOrDefault("CPU", 0);'
        }
      },
      {
        label: 'Multi-Threaded Concurrent High-Throughput System',
        detail: 'Massive parallel reads and writes across worker threads without global lock contention',
        recommendation: {
          name: 'ConcurrentHashMap',
          category: 'Concurrent Map',
          reason: 'ConcurrentHashMap uses lock-free CAS reads and synchronized bucket-level bin write locks, delivering exceptional multi-threaded scaling.',
          pros: ['Lock-free reads', 'Segment-level write locking', 'Thread-safe atomic compute methods'],
          codeSample: 'ConcurrentMap<String, Session> map = new ConcurrentHashMap<>();\nmap.computeIfAbsent("token", k -> createSession(k));'
        }
      },
      {
        label: 'Sorted Keys or Boundary Range Queries',
        detail: 'Keys must remain sorted in natural or comparator order',
        recommendation: {
          name: 'TreeMap',
          category: 'NavigableMap',
          reason: 'TreeMap maintains keys in a Red-Black BST, guaranteeing O(log n) bounds and rich boundary navigation (firstKey, floorEntry, subMap).',
          pros: ['Keys continuously sorted', 'Range & boundary subMap()', 'Deterministic O(log n) operations'],
          codeSample: 'NavigableMap<String, Double> map = new TreeMap<>();\nmap.put("AAPL", 220.0);\nMap.Entry<String, Double> match = map.floorEntry("AMZN");'
        }
      },
      {
        label: 'Least Recently Used (LRU) Cache or Insertion Order',
        detail: 'Evict oldest or least-recently-accessed entries when capacity is exceeded',
        recommendation: {
          name: 'LinkedHashMap',
          category: 'Map (LRU)',
          reason: 'LinkedHashMap supports access-order mode combined with removeEldestEntry() to create a complete LRU cache in 10 lines of code.',
          pros: ['O(1) lookup & eviction', 'Built-in LRU cache support', 'Predictable iteration order'],
          codeSample: 'Map<String, Object> lru = new LinkedHashMap<>(16, 0.75f, true) {\n    protected boolean removeEldestEntry(Map.Entry eldest) {\n        return size() > 100;\n    }\n};'
        }
      }
    ]
  },
  streams_flow: {
    id: 'streams_flow',
    question: 'What is the nature of your data processing task?',
    description: 'Determine the functional stream pipeline requirements.',
    options: [
      {
        label: 'Declarative Map-Reduce, Filtering, and Collection',
        detail: 'Transform collections without mutating sources in clean readable pipelines',
        recommendation: {
          name: 'Java Stream Pipeline',
          category: 'Functional Streams',
          reason: 'Java Streams provide lazy single-pass evaluation, short-circuit optimizations, and declarative map-reduce without boilerplate.',
          pros: ['Lazy evaluation', 'Short-circuiting (findFirst)', 'Immutable transformations'],
          codeSample: 'List<String> res = list.stream()\n    .filter(s -> s.length() > 3)\n    .map(String::toUpperCase)\n    .toList();'
        }
      },
      {
        label: 'Multi-Core CPU Intensive Parallel Processing',
        detail: 'Partitioning millions of CPU-bound calculations across available CPU cores',
        recommendation: {
          name: 'Parallel Stream (.parallelStream())',
          category: 'Parallel Streams',
          reason: 'Parallel streams automatically decompose Spliterators across ForkJoinPool.commonPool() for multi-core acceleration.',
          pros: ['Automatic ForkJoinPool work-stealing', 'Zero multi-threading boilerplate', 'Linear scaling on CPU-bound workloads'],
          codeSample: 'List<Double> res = numbers.parallelStream()\n    .map(MathEngine::calculateComplexFormula)\n    .toList();'
        }
      }
    ]
  }
};

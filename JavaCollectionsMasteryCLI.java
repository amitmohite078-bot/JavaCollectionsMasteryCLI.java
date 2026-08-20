import java.util.*;
import java.util.stream.Collectors;

public class JavaCollectionsMasteryCLI {

    // =========================================================================
    // PLAIN TEXT UI RENDERING ENGINE
    // =========================================================================
    public static final class UI {
        public static void printHeader(String title) {
            String line = "=".repeat(78);
            System.out.println("\n+" + line + "+");
            int padding = (78 - title.length()) / 2;
            String paddedTitle = " ".repeat(Math.max(0, padding)) + title;
            System.out.printf("| %-76s |%n", paddedTitle);
            System.out.println("+" + line + "+");
        }

        public static void printSection(String subtitle) {
            System.out.println("\n> " + subtitle.toUpperCase());
            System.out.println("-".repeat(subtitle.length() + 3));
        }

        public static void printSuccess(String msg) {
            System.out.println("[OK] " + msg);
        }

        public static void printError(String msg) {
            System.out.println("[ERROR] " + msg);
        }

        public static void printWarning(String msg) {
            System.out.println("[WARN] " + msg);
        }

        public static void printBox(String text) {
            String[] lines = text.split("\n");
            int maxLen = 0;
            for (String l : lines) {
                if (l.length() > maxLen) maxLen = l.length();
            }
            maxLen = Math.min(maxLen, 74);

            System.out.println("+" + "-".repeat(maxLen + 2) + "+");
            for (String l : lines) {
                System.out.printf("| %-" + maxLen + "s |%n", l);
            }
            System.out.println("+" + "-".repeat(maxLen + 2) + "+");
        }
    }

    // =========================================================================
    // DOMAIN MODELS
    // =========================================================================
    public record OperationDeepDive(
        String name,
        String timeComplexity,
        String spaceComplexity,
        String syntax,
        String internalWorking,
        List<String> keyMechanics
    ) {}

    public record ArchitectureData(
        String definition,
        String coreArchitecture,
        String basicSyntax,
        List<String> keyPoints,
        List<String> advantages,
        List<String> disadvantages
    ) {}

    public record ExplanationData(
        ArchitectureData architectureOverview,
        List<OperationDeepDive> operations
    ) {}

    public record RealWorldScenario(String domain, String problem, String solutionRationale) {}

    public record InterviewQA(String companyCategory, String question, String modelAnswer) {}

    public record QuizQuestion(
        String difficulty,
        String question,
        List<String> options,
        char correctOption,
        String explanation
    ) {}

    public record TopicContent(
        int id,
        String title,
        String topicMindMap,
        ExplanationData explanation,
        List<RealWorldScenario> realWorldScenarios,
        List<InterviewQA> interviewQAs,
        List<QuizQuestion> quizPool
    ) {}

    // =========================================================================
    // REPOSITORY & DATA SOURCES
    // =========================================================================
    public static final class MasteryRepository {
        private static final Map<Integer, TopicContent> TOPICS = new LinkedHashMap<>();

        static {
            TOPICS.put(1, createArrayList());
            TOPICS.put(2, createLinkedList());
            TOPICS.put(3, createHashSet());
            TOPICS.put(4, createTreeSet());
            TOPICS.put(5, createHashMap());
            TOPICS.put(6, createJavaStreams());
        }

        public static TopicContent getTopic(int id) {
            return TOPICS.get(id);
        }

        public static Map<Integer, TopicContent> getAllTopics() {
            return Collections.unmodifiableMap(TOPICS);
        }

        public static String getMasterCollectionsMindMap() {
            return """
            ==============================================================================
                                 JAVA COLLECTIONS & STREAMS MASTER MIND MAP
            ==============================================================================
            
            Iterable<T> (root interface)
             |
             +---> Collection<T>
                    |
                    +---> List<E> (Ordered, Index-Accessible, Allows Duplicates)
                    |      |-- ArrayList         [Contiguous Object[] | O(1) Read | Amortized O(1) Add]
                    |      |-- LinkedList        [Doubly-Linked Nodes | O(1) Ends | O(n) Read]
                    |      +-- Vector / Stack    [Synchronized Legacy | Doubling Capacity]
                    |
                    +---> Set<E> (Unique Elements, Fast Membership Testing)
                    |      |-- HashSet           [HashMap-Backed | Unordered | O(1) Avg Lookup]
                    |      |-- LinkedHashSet     [Doubly-Linked Bucket Chains | Insertion Order]
                    |      +-- SortedSet<E> ---> NavigableSet<E>
                    |                             +-- TreeSet [Red-Black Tree | Natural/Custom Sort | O(log n)]
                    |
                    +---> Queue<E> / Deque<E> (FIFO / LIFO / Priority Processing)
                           |-- ArrayDeque        [Circular Resizable Array | Zero Allocation GC | Fast Stack/Queue]
                           |-- PriorityQueue     [Binary Min-Heap | Priority Polling | O(log n)]
                           +-- LinkedList        [Deque Implementation via Pointers]
            
            Map<K, V> (Independent Key-Value Hierarchy, Unique Keys)
             |-- HashMap           [Array of Buckets + Treeification (Node/TreeNode) | O(1) Avg]
             |-- LinkedHashMap     [HashMap + Doubly-Linked Iteration Chain | LRU Cache Core]
             |-- ConcurrentHashMap [CAS + Synchronized Bucket Bins | Segmented Concurrency]
             +-- SortedMap<K,V> ---> NavigableMap<K,V>
                                      +-- TreeMap [Red-Black Tree | Key-Sorted | O(log n)]
            
            BaseStream<T, S> (Functional Lazy Pipeline Engine)
             +---> Stream<T> / IntStream / LongStream / DoubleStream
                    |-- Sources          [Collection.stream(), Arrays.stream(), Stream.of()]
                    |-- Intermediate     [filter(), map(), flatMap(), sorted(), distinct()] -> Lazy
                    |-- Terminal         [collect(), reduce(), count(), forEach(), findFirst()] -> Eager
                    +-- Parallelism      [Spliterator.trySplit() + ForkJoinPool.commonPool()]
            """;
        }

        public static String getMasterComparisonMatrix() {
            return """
            +---------------+--------------------+------------+------------+-----------+--------------+-----------------------+
            | Collection    | Backing Structure  | Get/Read   | Insertion  | Deletion  | Duplicates   | Optimal Use Case      |
            +---------------+--------------------+------------+------------+-----------+--------------+-----------------------+
            | ArrayList     | Resizable Object[] | O(1)       | O(1)*      | O(n)      | Allowed      | Read-heavy index scan |
            | LinkedList    | Doubly-Linked Node | O(n)       | O(1) ends  | O(1) ends | Allowed      | FIFO / Deque ends ops |
            | HashSet       | Hash Table (Map)   | O(1) avg   | O(1) avg   | O(1) avg  | Disallowed   | Deduplication / Check |
            | TreeSet       | Red-Black BST      | O(log n)   | O(log n)   | O(log n)  | Disallowed   | Live Range / Sorting  |
            | HashMap       | Buckets + RB-Tree  | O(1) avg   | O(1) avg   | O(1) avg  | Unique Keys  | Fast Key-Value Cache  |
            | Java Streams  | Spliterator Pipe   | O(n) lazy  | N/A (Flow) | N/A (Flow)| Source-based | Map/Reduce Analytics  |
            +---------------+--------------------+------------+------------+-----------+--------------+-----------------------+
            * Amortized constant time; worst-case O(n) when backing buffer triggers resizing copy.
            """;
        }

        public static String getArrayListVsLinkedListComparison() {
            return """
            ==============================================================================
                                 FACE-OFF: ARRAYLIST vs LINKEDLIST
            ==============================================================================
            Feature              ArrayList                       LinkedList
            ------------------------------------------------------------------------------
            Data Structure       Contiguous Resizable Array   Doubly-Linked Node Pointers
            Positional Read      O(1) [Direct Offset]         O(n) [Traverses up to n/2 nodes]
            Head Insert/Delete   O(n) [Requires shift]        O(1) [linkFirst / unlinkFirst]
            Tail Insert/Delete   Amortized O(1)               O(1) [linkLast / unlinkLast]
            Middle Insert/Delete O(n) [System.arraycopy]      O(n) traversal + O(1) rewire
            Memory Overhead      Low (Only unused capacity)   High (24-32 bytes per node pointer)
            CPU Cache Hits       Superior (Contiguous array)  Poor (Pointer chasing across heap)
            Recommended For      General lists, bulk scans    Queues, Stacks (prefer ArrayDeque)
            """;
        }

        public static String getHashSetVsTreeSetComparison() {
            return """
            ==============================================================================
                                 FACE-OFF: HASHSET vs TREESET
            ==============================================================================
            Feature              HashSet                       TreeSet
            ------------------------------------------------------------------------------
            Internal Structure   HashMap (Hash table buckets)  TreeMap (Red-Black BST)
            Time Complexity      O(1) Average                  Guaranteed O(log n)
            Ordering Guarantee   None (Non-deterministic)      Natural or Custom Comparator
            Null Elements        Allows 1 null (bucket 0)      Disallows null (throws NPE)
            Uniqueness Check     hashCode() + equals()         compareTo() or compare() == 0
            Range Queries        Not Supported                 Supported (floor, ceiling, subSet)
            Memory Footprint     Moderate (Table + Nodes)      Higher (Left/Right/Parent/Color)
            Recommended For      Fast O(1) deduplication       Real-time sorted boundary queries
            """;
        }

        public static String getHashMapVsTreeMapVsConcurrentMapComparison() {
            return """
            ==============================================================================
                           FACE-OFF: HASHMAP vs TREEMAP vs CONCURRENTHASHMAP
            ==============================================================================
            Feature           HashMap             TreeMap             ConcurrentHashMap
            ------------------------------------------------------------------------------
            Underlying Engine Buckets + RB-Tree   Red-Black BST       CAS + Node Bin Locks
            Time Complexity   O(1) Average        O(log n) Guaranteed O(1) Average
            Thread Safety     No                  No                  Yes (Lock-free reads)
            Null Keys/Values  1 Null Key, Any Val Rejects Null Keys   Rejects ALL Nulls
            Key Ordering      None                Sorted (In-Order)   None
            Concurrent Mod    Fail-Fast (Throws)  Fail-Fast (Throws)  Weakly Consistent (Safe)
            Recommended For   Standard Key-Value  Sorted Key Queries  High-throughput Multithreading
            """;
        }

        public static String getCollectionVsStreamsComparison() {
            return """
            ==============================================================================
                           FACE-OFF: JAVA COLLECTIONS vs JAVA STREAMS
            ==============================================================================
            Dimension            Collections Framework          Java Streams Engine
            ------------------------------------------------------------------------------
            Core Purpose         In-memory data storage         Functional data computation
            Evaluation Strategy  Eager (Allocates & constructs) Lazy (Executes upon terminal call)
            Reusability          Reusable multiple times        Single-use (Consumed once)
            Mutation Nature      In-place data mutation         Pure transformation (Immutable)
            Iteration Paradigm   External (for / while loops)   Internal (forEach / collect)
            Parallelism Engine   Manual Thread Pools / Locks    Declarative (.parallelStream())
            Memory Overhead      Stores full data in memory     Processes elements on-the-fly
            """;
        }

        public static String getDecisionMatrixGuide() {
            return """
            ==============================================================================
                                 DECISION MATRIX: WHICH COLLECTION TO USE?
            ==============================================================================
            Need                             Recommended Choice       Key Rationale
            ------------------------------------------------------------------------------
            Direct indexed lookups           -> ArrayList             O(1) memory offset
            FIFO Queue / LIFO Stack          -> ArrayDeque            Faster than LinkedList, zero GC
            Unique set without sorting       -> HashSet               O(1) membership validation
            Unique set with sorted ranges    -> TreeSet               O(log n) boundary search
            Associative Key-Value store      -> HashMap               Fast O(1) average lookup
            Key-Value with sorting           -> TreeMap               Sorted keys via Comparator
            Thread-safe Key-Value cache      -> ConcurrentHashMap     Segment-level non-blocking I/O
            Declarative Map-Reduce filtering -> Java Streams          Lazy short-circuit pipeline
            """;
        }

        private static TopicContent createArrayList() {
            String mindMap = """
            [ArrayList Mind Map]
            Iterable -> Collection -> List -> ArrayList
              |-- Backing Storage : Object[] elementData (Contiguous Memory)
              |-- Growth Factor   : newCapacity = oldCapacity + (oldCapacity >> 1) [1.5x]
              |-- Performance     : Access: O(1) | Append: Amortized O(1) | Shift Insert/Delete: O(n)
              +-- Memory Locality : Superior (L1/L2 Spatial Cache Locality)
            """;

            ArchitectureData arch = new ArchitectureData(
                "A resizable dynamic array implementation of the List interface maintaining indexed insertion order.",
                "Backed by an Object[] elementData array. Default initial capacity is 10. Resizing formula: newCapacity = oldCapacity + (oldCapacity >> 1).",
                "List<String> list = new ArrayList<>();\nlist.add(\"Java\");\nString val = list.get(0);",
                List.of(
                    "Implements RandomAccess marker interface guaranteeing O(1) direct index lookups.",
                    "Preserves element insertion order and permits duplicates as well as nulls.",
                    "Contiguous memory layout maximizes CPU L1/L2 cache locality.",
                    "Not thread-safe; concurrent structural modifications require manual synchronization."
                ),
                List.of(
                    "O(1) constant time random positional reads via memory offset calculation.",
                    "Low per-element memory overhead compared to pointer-heavy nodes.",
                    "High throughput for append-heavy sequential data ingestion."
                ),
                List.of(
                    "Costly O(n) middle insertions/deletions due to element array shifts.",
                    "Resizing incurs latency spikes when copying large backing arrays.",
                    "Unused allocated capacity headroom can waste RAM if not trimmed."
                )
            );

            List<OperationDeepDive> ops = List.of(
                new OperationDeepDive("Insertion", "Amortized O(1) append; O(n) positional insert", "O(1) aux", "list.add(\"Item\");\nlist.add(2, \"Middle\");", "Appending assigns elementData[size++]. If full, grow() allocates a 1.5x array and copies items via Arrays.copyOf. Positional insertion shifts elements right via System.arraycopy.", List.of("Checks ensureCapacityInternal(size + 1)", "Vectorized shift via System.arraycopy", "Assigns element and increments modCount")),
                new OperationDeepDive("Deletion", "O(n) average/worst; O(1) for last element", "O(1)", "list.remove(2);\nlist.remove(\"Item\");", "Positional remove calculates numMoved = size - index - 1 and shifts elements left with System.arraycopy. Nullifies trailing index elementData[--size] = null to prevent memory leaks.", List.of("Calculates shift offset", "Left-shifts elements via System.arraycopy", "Nullifies trailing slot to allow Garbage Collection")),
                new OperationDeepDive("Searching", "O(1) for get(index); O(n) for contains() / indexOf()", "O(1)", "String item = list.get(0);\nboolean exists = list.contains(\"Item\");", "get(i) verifies bounds and evaluates (E) elementData[i] directly. contains() and indexOf() iterate linearly from 0 to size-1 executing equals() checks.", List.of("Direct memory pointer offset calculation", "Linear iteration handles null safely", "Binary search runs in O(log n) if pre-sorted via Collections.binarySearch")),
                new OperationDeepDive("Sorting", "O(n log n)", "O(n) aux", "list.sort(Comparator.naturalOrder());", "Delegates to Arrays.sort(elementData, 0, size, c) which runs Adaptive Timsort (hybrid Merge/Insertion sort). Finds pre-sorted runs and merges with minimal comparisons.", List.of("Timsort guarantees O(n log n) worst-case", "Stable sort preserving equal element order", "Executes in-place on underlying array buffer"))
            );

            return new TopicContent(1, "ArrayList", mindMap, new ExplanationData(arch, ops), generateScenarios("ArrayList"), generateQAs("ArrayList"), generateQuizzes("ArrayList"));
        }

        private static TopicContent createLinkedList() {
            String mindMap = """
            [LinkedList Mind Map]
            Iterable -> Collection -> List / Deque / Queue -> LinkedList
              |-- Backing Storage : Doubly-Linked Node<E> (item, next, prev)
              |-- Endpoints       : Direct first and last references
              |-- Performance     : Endpoints: O(1) | Mid Traversals: O(n)
              +-- Overheads       : 24-32 bytes per node + GC allocation pressure
            """;

            ArchitectureData arch = new ArchitectureData(
                "A doubly-linked node-based sequence implementing List, Deque, and Queue interfaces.",
                "Maintains distinct Node<E> instances on heap containing item, next, and prev references. Retains first and last endpoint pointers.",
                "Deque<String> deque = new LinkedList<>();\ndeque.addFirst(\"Head\");\ndeque.addLast(\"Tail\");",
                List.of(
                    "Implements Deque, acting as a FIFO Queue, LIFO Stack, or Double-Ended Queue.",
                    "No fixed capacity or contiguous memory allocation required upfront.",
                    "Elements can be inserted and deleted at extremities in O(1) time.",
                    "Traversing requires pointer dereferencing across non-contiguous heap allocations."
                ),
                List.of(
                    "Guaranteed O(1) constant time insertion and deletion at head and tail.",
                    "Dynamic scaling without memory-resizing spikes or unused pre-allocated capacity.",
                    "Direct reference unlinking runs in true O(1) time."
                ),
                List.of(
                    "High memory overhead (24-32 bytes per node on 64-bit JVMs).",
                    "Poor CPU cache locality due to scattered pointer addresses.",
                    "O(n) random indexed access (requires traversing up to n/2 nodes)."
                )
            );

            List<OperationDeepDive> ops = List.of(
                new OperationDeepDive("Insertion", "O(1) at endpoints; O(n) at arbitrary index", "O(1)", "list.addFirst(\"Start\");\nlist.add(5, \"Mid\");", "linkFirst and linkLast instantiate Node<>(prev, e, next) and rewire adjacent endpoint pointers. Positional add traverses n/2 nodes before calling linkBefore().", List.of("linkFirst(e): Node<E> f = first; first = new Node<>(null, e, f)", "Zero element shifts or array copies", "Creates new Node wrapper allocation")),
                new OperationDeepDive("Deletion", "O(1) at endpoints; O(n) by value or index", "O(1)", "list.removeFirst();\nlist.remove(\"Target\");", "unlinkFirst and unlinkLast rewire head/tail pointers and null out references. Positional or value removal traverses to target node and splices prev.next = next and next.prev = prev.", List.of("unlink(x): x.prev.next = x.next; x.next.prev = x.prev", "Nullifies internal item/pointers to assist GC", "Decrements size and increments modCount")),
                new OperationDeepDive("Searching", "O(1) for endpoints; O(n) for get(index)", "O(1)", "String head = list.getFirst();\nString mid = list.get(5);", "get(index) calls node(index), which traverses from first if index < (size >> 1), otherwise backward from last. contains() traverses sequentially comparing equals().", List.of("Bidirectional traversal starting from closest endpoint", "Pointer chasing causes CPU cache misses", "No direct memory offset indexing")),
                new OperationDeepDive("Sorting", "O(n log n)", "O(n) aux", "list.sort(Comparator.naturalOrder());", "LinkedList does not sort in-place across pointers. It dumps nodes to an Object[] array, sorts via Arrays.sort (Timsort), and writes sorted items back into node payloads.", List.of("Converts list to array via toArray()", "Sorts array via Timsort", "Rewrites values back using ListIterator"))
            );

            return new TopicContent(2, "LinkedList", mindMap, new ExplanationData(arch, ops), generateScenarios("LinkedList"), generateQAs("LinkedList"), generateQuizzes("LinkedList"));
        }

        private static TopicContent createHashSet() {
            String mindMap = """
            [HashSet Mind Map]
            Iterable -> Collection -> Set -> HashSet
              |-- Backing Storage : HashMap<E, Object> (Key = Element, Value = PRESENT)
              |-- Bucketing       : index = (capacity - 1) & hash
              |-- Performance     : Add / Contains / Remove: O(1) Average
              +-- Collision Action: Separate Chaining -> Treeification at 8 collisions
            """;

            ArchitectureData arch = new ArchitectureData(
                "An unordered, unique-element collection backed internally by an instance of HashMap.",
                "Stores elements as keys in a private transient HashMap<E, Object> map. Values are associated with a single shared dummy Object constant (PRESENT).",
                "Set<String> set = new HashSet<>();\nset.add(\"Alpha\");\nboolean exists = set.contains(\"Alpha\");",
                List.of(
                    "Guarantees element uniqueness based on key.hashCode() and key.equals() contracts.",
                    "Provides O(1) average time complexity for insertion, removal, and lookup.",
                    "Permits a single null element entry (mapped to bucket index 0).",
                    "Provides no ordering guarantees; iteration order can change across table resizes."
                ),
                List.of(
                    "Constant time performance on basic operations under uniform hash distribution.",
                    "Automatic duplicate rejection without manual conditional checks.",
                    "Simple API interoperability with collection bulk operations (addAll, retainAll)."
                ),
                List.of(
                    "Iteration performance depends on total capacity plus size O(capacity + size).",
                    "Performance degrades to O(log n) or O(n) under severe hash collisions.",
                    "Higher memory consumption than primitive or array sets due to HashMap.Node instances."
                )
            );

            List<OperationDeepDive> ops = List.of(
                new OperationDeepDive("Insertion", "O(1) average; O(log n) worst case (treeified bucket)", "O(1)", "boolean added = set.add(\"Key\");", "Executes map.put(e, PRESENT) == null. Computes hash = (h = key.hashCode()) ^ (h >>> 16) and assigns bucket index (n - 1) & hash. Appends Node if unique.", List.of("Computes 16-bit spread hash", "Calculates table bucket index", "Returns true only if key was previously absent")),
                new OperationDeepDive("Deletion", "O(1) average; O(log n) worst case", "O(1)", "boolean removed = set.remove(\"Key\");", "Delegates to map.remove(o) == PRESENT. Hashes object, locates bucket bin, unlinks Node from singly-linked chain or Red-Black tree, and decrements size.", List.of("Locates bucket via hash", "Unlinks Node or calls removeTreeNode", "Returns true if object was found and detached")),
                new OperationDeepDive("Searching", "O(1) average; O(log n) worst case", "O(1)", "boolean exists = set.contains(\"Key\");", "Executes map.containsKey(o). Hashes key, locates bucket, and traverses nodes checking hash equality followed by identity or equals() equivalence.", List.of("Fast identity check ((k = p.key) == key) optimizes comparison", "Iterates only across colliding bucket nodes", "Returns false immediately if target bucket is empty")),
                new OperationDeepDive("Sorting", "O(n log n) via external collection", "O(n) aux", "List<String> sorted = new ArrayList<>(set);\nCollections.sort(sorted);", "HashSet cannot be sorted directly due to its hash bucket structure. Elements must be dumped into an ArrayList for sorting or into a TreeSet.", List.of("HashSet has no native ordering or indexed access", "Requires copying elements to an ordered structure", "Stream sorting: set.stream().sorted().toList()"))
            );

            return new TopicContent(3, "HashSet", mindMap, new ExplanationData(arch, ops), generateScenarios("HashSet"), generateQAs("HashSet"), generateQuizzes("HashSet"));
        }

        private static TopicContent createTreeSet() {
            String mindMap = """
            [TreeSet Mind Map]
            Iterable -> Collection -> Set -> SortedSet -> NavigableSet -> TreeSet
              |-- Backing Storage : TreeMap (Red-Black Self-Balancing Binary Search Tree)
              |-- Invariants      : Black Root, No Two Reds Adjacent, Uniform Black-Height
              |-- Performance     : Add / Remove / Contains: Guaranteed O(log n)
              +-- Navigable Ops   : floor(), ceiling(), lower(), higher(), subSet()
            """;

            ArchitectureData arch = new ArchitectureData(
                "A sorted, NavigableSet implementation backed internally by a Red-Black self-balancing binary search tree (via NavigableMap/TreeMap).",
                "Maintains elements ordered by natural ordering (Comparable) or an explicit Comparator. Balances tree depth to at most 2 * log(n + 1) using Red-Black coloring rules and node rotations.",
                "NavigableSet<Integer> set = new TreeSet<>();\nset.add(50);\nint floor = set.floor(25);",
                List.of(
                    "Guarantees strict O(log n) time boundaries for add, remove, and contains.",
                    "Provides navigable inspection operations: floor, ceiling, lower, higher, and subSet.",
                    "Does not permit null elements (throws NullPointerException upon compare).",
                    "Evaluates equality strictly through compareTo() or compare(), ignoring equals()."
                ),
                List.of(
                    "Elements remain sorted at all times as insertions/deletions occur.",
                    "Fast logarithmic boundary and range search queries.",
                    "Deterministic performance immune to hash collision degradation."
                ),
                List.of(
                    "Slower than HashSet for standard single-key reads/writes (O(log n) vs O(1)).",
                    "Requires elements to implement Comparable or requires a custom Comparator.",
                    "Higher per-node pointer overhead (parent, left, right, color, key)."
                )
            );

            List<OperationDeepDive> ops = List.of(
                new OperationDeepDive("Insertion", "O(log n)", "O(1)", "set.add(42);", "Traverses from root comparing keys via compare(). Attaches Entry<>(key, value, parent) at leaf. Calls fixAfterInsertion() to execute color flips and rotations if parent was red.", List.of("Binary search tree traversal: left if < 0, right if > 0", "Rejects duplicate if compare == 0", "Restores Red-Black invariants in at most 2 rotations")),
                new OperationDeepDive("Deletion", "O(log n)", "O(1)", "set.remove(42);", "Locates node in O(log n). If node has two children, replaces key with in-order successor and unlinks successor. Calls fixAfterDeletion() if a black node was removed.", List.of("Locates in-order successor", "Unlinks target node with at most one child", "Restores black-height invariants in at most 3 rotations")),
                new OperationDeepDive("Searching", "O(log n)", "O(1)", "boolean found = set.contains(42);\nint higher = set.higher(42);", "Executes getEntry(k) starting at root, branching left/right depending on compare() result. Range queries (floor, ceiling) track closest branch candidate match.", List.of("Logarithmic depth branch traversal", "Navigable boundary search without full iteration", "Zero hash calculation overhead")),
                new OperationDeepDive("Sorting", "O(1) inherent (continuous)", "O(1)", "for (int n : set) System.out.println(n);\nNavigableSet<Integer> rev = set.descendingSet();", "TreeSet is inherently sorted. Iteration performs an in-order tree traversal (left subtree, root, right subtree) using successor() pointers in O(n) total time without sorting passes.", List.of("In-order traversal yields sorted order", "descendingSet() provides inverted view in O(1)", "No external sorting passes needed"))
            );

            return new TopicContent(4, "TreeSet", mindMap, new ExplanationData(arch, ops), generateScenarios("TreeSet"), generateQAs("TreeSet"), generateQuizzes("TreeSet"));
        }

        private static TopicContent createHashMap() {
            String mindMap = """
            [HashMap Mind Map]
            Map<K, V> -> HashMap<K, V>
              |-- Backing Array   : Node<K,V>[] table (Power-of-Two capacity)
              |-- Bitmask Index   : index = (n - 1) & (hash ^ (hash >>> 16))
              |-- Treeification   : Bin Size >= 8 AND Total Capacity >= 64 -> Red-Black Tree
              +-- Resizing Rule   : Size > Capacity * 0.75 -> 2x Capacity
            """;

            ArchitectureData arch = new ArchitectureData(
                "A hash table-based key-value map providing constant time associative lookups and modifications.",
                "Backed by a dynamic Node<K,V>[] table. Computes bin index via bitmask (n - 1) & hash. Resolves collisions via separate chaining. In Java 8+, converts bucket list into Red-Black Tree when bin count >= 8 and table capacity >= 64.",
                "Map<String, Integer> map = new HashMap<>();\nmap.put(\"USD\", 100);\nint val = map.getOrDefault(\"USD\", 0);",
                List.of(
                    "Allows one null key (placed in bucket 0) and multiple null values.",
                    "Table capacity is constrained to powers of two (2^n) to optimize bitmask indexing.",
                    "Threshold formula: threshold = capacity * loadFactor (default load factor is 0.75).",
                    "Not thread-safe; concurrent writes can corrupt internal node pointer chains."
                ),
                List.of(
                    "High performance O(1) average time complexity for associative storage and retrieval.",
                    "Treeification protects against algorithmic hash collision (HashDoS) attacks.",
                    "Rich functional methods: computeIfAbsent, computeIfPresent, merge."
                ),
                List.of(
                    "Resizing allocates a 2x table and re-indexes all nodes (O(n) latency cost).",
                    "High initial capacity combined with low load factor can lead to memory waste.",
                    "Iteration order is non-deterministic and shifts across resizing passes."
                )
            );

            List<OperationDeepDive> ops = List.of(
                new OperationDeepDive("Insertion", "O(1) average; O(log n) worst-case collision", "O(1)", "map.put(\"Key\", 100);\nmap.putIfAbsent(\"K2\", 200);", "Computes hash = (h = key.hashCode()) ^ (h >>> 16). Bucket index i = (n - 1) & hash. If empty, creates new Node. If populated, traverses list/tree matching hash and equals(). Appends at tail. Resizes 2x if ++size > threshold.", List.of("High-to-low 16-bit hash spreading", "Tail-insertion in bucket list (Java 8+)", "Treeifies bin when bin count >= 8 and capacity >= 64")),
                new OperationDeepDive("Deletion", "O(1) average; O(log n) worst-case", "O(1)", "map.remove(\"Key\");\nmap.remove(\"Key\", 100);", "Hashes key, locates bucket (n - 1) & hash, finds matching node. Unlinks node from list or calls removeTreeNode(). Untreeifies to list if bin size drops to 6. Decrements size.", List.of("Locates node via hash and equals()", "Unlinks from linked list or balances tree", "Returns old value or null")),
                new OperationDeepDive("Searching", "O(1) average; O(log n) worst-case", "O(1)", "Integer val = map.get(\"Key\");\nboolean hasK = map.containsKey(\"Key\");", "Computes hash and inspects table[(n - 1) & hash]. Checks root node. If not equal, queries TreeNode.find() or iterates singly-linked next chain.", List.of("Direct root node check optimizes 90%+ lookups", "Key lookup is O(1); value lookup containsValue() is O(n)", "Null key resolves directly to bucket 0")),
                new OperationDeepDive("Sorting", "O(n log n) external conversion", "O(n) aux", "Map<String, Integer> sorted = new TreeMap<>(map);", "HashMap does not store entries in sorted order. To sort by keys, load entries into a TreeMap. To sort by values, stream entrySet() using Map.Entry.comparingByValue().", List.of("Bucket distribution shifts across resizes", "Key sorting: transfer to TreeMap", "Value sorting: stream and collect into LinkedHashMap"))
            );

            return new TopicContent(5, "HashMap", mindMap, new ExplanationData(arch, ops), generateScenarios("HashMap"), generateQAs("HashMap"), generateQuizzes("HashMap"));
        }

        private static TopicContent createJavaStreams() {
            String mindMap = """
            [Java Streams Mind Map]
            BaseStream -> Stream<T> (Functional Map-Reduce Pipeline)
              |-- Source Stage       : Collection.stream(), Arrays.stream()
              |-- Intermediate (Lazy): filter(), map(), sorted(), distinct(), flatMap()
              |-- Terminal (Eager)   : collect(), reduce(), forEach(), findFirst()
              +-- Parallelism        : Spliterator.trySplit() -> ForkJoinPool.commonPool()
            """;

            ArchitectureData arch = new ArchitectureData(
                "A functional, declarative pipeline supporting map-reduce transformations and parallel evaluation over element sequences.",
                "Built atop Spliterator sources. Stream stages form a doubly-linked pipeline of Sink objects (ReferencePipeline). Intermediate stages are evaluated lazily upon triggering a Terminal operation.",
                "List<String> res = list.stream()\n    .filter(s -> s.length() > 3)\n    .map(String::toUpperCase)\n    .toList();",
                List.of(
                    "Streams do not store data; they transform elements from underlying collections/channels.",
                    "Intermediate operations return a new lazy Stream without executing processing steps.",
                    "Terminal operations (collect, reduce, forEach) trigger one-pass iteration.",
                    "Streams cannot be reused once consumed; re-invoking throws IllegalStateException."
                ),
                List.of(
                    "High readability and declarative code eliminating explicit state management.",
                    "Lazy evaluation avoids unnecessary operations through short-circuiting.",
                    "Simple multi-core parallelization via .parallelStream()."
                ),
                List.of(
                    "Performance overhead from lambda allocations and object boxing on small datasets.",
                    "Difficult step-by-step stack-trace debugging.",
                    "Uncoordinated parallel streams can saturate ForkJoinPool.commonPool()."
                )
            );

            List<OperationDeepDive> ops = List.of(
                new OperationDeepDive("Insertion / Creation", "O(1) pipeline construction", "O(1)", "Stream<String> s = list.stream();\nStream<Integer> s2 = Stream.of(1, 2, 3);", "Instantiates ReferencePipeline.Head wrapping source Spliterator. Stage tracks encounter characteristics (SIZED, DISTINCT, ORDERED). Zero element evaluation occurs at creation.", List.of("Obtains Spliterator from source collection", "Constructs pipeline Head stage", "Lazy: zero computation until terminal invocation")),
                new OperationDeepDive("Deletion / Filtering", "O(n)", "O(1) aux", "stream.filter(Objects::nonNull).filter(s -> !s.isEmpty());", "filter(Predicate) wraps downstream Sink in Sink.ChainedReference. accept(u) checks predicate. If true, forwards to downstream.accept(u); if false, drops element without buffering.", List.of("Stateless intermediate transformation", "Zero intermediate buffer allocations", "Elements evaluate one-by-one")),
                new OperationDeepDive("Searching / Matching", "O(1) to O(n) (Short-circuiting)", "O(1)", "Optional<String> first = stream.filter(p).findFirst();\nboolean any = stream.anyMatch(p);", "findFirst and anyMatch are short-circuiting terminal operations. When condition is met, sets stop cancellation flag, breaking upstream Spliterator loop immediately.", List.of("findFirst preserves encounter order", "Aborts pulling from upstream Spliterator on match", "Returns Optional to eliminate NullPointerException risks")),
                new OperationDeepDive("Sorting", "O(n log n)", "O(n) aux buffer", "stream.sorted().sorted(Comparator.reverseOrder());", "sorted() is a stateful intermediate operation. Buffers upstream elements into a temporary Object[] Sink array until end() signals upstream exhaustion, then calls Arrays.sort() and emits downstream.", List.of("Stateful barrier: halts pipeline until all elements are buffered", "Uses Timsort algorithm internally", "Bypasses sort if stream has SORTED flag"))
            );

            return new TopicContent(6, "Java Streams", mindMap, new ExplanationData(arch, ops), generateScenarios("Java Streams"), generateQAs("Java Streams"), generateQuizzes("Java Streams"));
        }

        private static List<RealWorldScenario> generateScenarios(String topic) {
            List<RealWorldScenario> list = new ArrayList<>();
            String[][] domains = {
                {"E-Commerce Catalog Display", "Efficient paginated item indexing and display across heavy user traffic."},
                {"High-Speed Memory Caching", "Minimizing cache lookup overhead for read-intensive microservices."},
                {"Financial Audit Logging", "High-frequency in-memory buffering before flushing records to cold storage."},
                {"Real-Time Ingest Pipeline", "De-duplicating incoming telemetry packets under sub-millisecond SLAs."},
                {"API Rate Limiter Tokens", "Sliding window token tracking to enforce client rate throttling limits."},
                {"Graph Traversal Visited Set", "Preventing cyclical loop traversals in large distributed graphs."},
                {"Stock Order Book Execution", "Continuous sorting of bids and asks for instantaneous limit order matching."},
                {"Leaderboard Rank Engine", "Tracking live top-tier player rankings and range query slicing."},
                {"Microservice Session Store", "Fast token-to-user session identity lookup per incoming HTTP request."},
                {"Distributed Shard Registry", "Resolving database partition shard mappings with O(1) hash routing."},
                {"Compiler Symbol Table", "Variable and function identifier resolution during abstract syntax tree parsing."},
                {"Asynchronous Task Queue", "FIFO scheduling and draining of asynchronous jobs across background workers."},
                {"Undo/Redo Command Stack", "Reversible state transition stack maintenance with endpoint manipulation."},
                {"Fraud Detection Pipeline", "Multi-stage rule filtering and short-circuit evaluation on high-value transfers."},
                {"Log Aggregation Metrics", "Declarative partitioning and group-by aggregations on distributed server logs."},
                {"Multi-Core Data Processing", "Parallel partitioning of multi-gigabyte data feeds across available CPU cores."},
                {"Mobile GPS Breadcrumbs", "Sequential append and tracking of geocoordinates during active user trips."},
                {"IoT Device Telemetry Pool", "Associative device-id to firmware metrics state synchronization."},
                {"Database Connection Pool", "Fixed-size resource acquisition and release tracking for high-throughput I/O."},
                {"Batch Settlement Reconciler", "Fast collection diffing and element intersection for end-of-day bank balances."}
            };

            for (int i = 0; i < 20; i++) {
                list.add(new RealWorldScenario(
                    domains[i][0],
                    domains[i][1],
                    "Architectural Choice: " + topic + " provides optimal space/time efficiency and predictable memory performance for " + domains[i][0].toLowerCase() + "."
                ));
            }
            return list;
        }

        private static List<InterviewQA> generateQAs(String topic) {
            List<InterviewQA> list = new ArrayList<>();

            String[][] serviceQAs = {
                {"What is the core purpose and interface hierarchy of " + topic + "?", topic + " belongs to the java.util framework and provides standardized data management contracts."},
                {"Is " + topic + " thread-safe by default?", "No, " + topic + " is unsynchronized for maximum single-threaded throughput. Use synchronized wrappers or concurrent alternatives if needed."},
                {"What causes ConcurrentModificationException in " + topic + "?", "Triggered when an uncoordinated structural mutation occurs while iterating, violating the fail-fast iterator contract."},
                {"What is the time complexity of basic read/write operations in " + topic + "?", "Standard operations range from O(1) to O(log n) depending on whether it relies on arrays, hash tables, trees, or pipelines."},
                {"How does " + topic + " handle null elements?", "Null handling depends on whether hashing or comparisons are required. Collections using compareTo() reject nulls; hash/array collections permit them."},
                {"How do you synchronize " + topic + " for multi-threaded environments?", "Wrap it with Collections.synchronizedCollection() or utilize specialized java.util.concurrent concurrent data structures."},
                {"What is the difference between Fail-Fast and Fail-Safe iterators in " + topic + "?", "Fail-fast iterators throw ConcurrentModificationException on structural changes; fail-safe iterators operate on cloned snapshots."},
                {"How do you convert " + topic + " to an Array or vice versa?", "Use toArray() to convert to an array, and Arrays.asList() or List.of() to initialize from an array."},
                {"What is the default memory and initial capacity behavior of " + topic + "?", "Default initial capacity typically ranges between 10 to 16 with standard expansion load factors (e.g., 0.75 or 1.5x growth)."},
                {"When should an engineer avoid using " + topic + "?", "Avoid when memory constraints, strict access patterns (e.g. pure LIFO/FIFO), or multi-threaded contention make specialized structures superior."}
            };

            for (String[] qa : serviceQAs) {
                list.add(new InterviewQA("Service-Based", qa[0], qa[1]));
            }

            String[][] productQAs = {
                {"Explain the deep internal architecture and data backing of " + topic + ".", topic + " manages memory layout directly via arrays, linked node references, red-black binary search trees, or lazy Spliterator pipelines."},
                {"How does " + topic + " interact with CPU cache lines and spatial memory locality?", "Contiguous array-backed collections provide superior cache-line prefetching, whereas pointer-linked node structures suffer frequent L1/L2 cache misses."},
                {"Explain the amortized time complexity analysis for resizing in " + topic + ".", "Exponential capacity expansion (e.g., 1.5x or 2x) ensures total resizing copy cost over N additions is bounded by O(N), yielding O(1) amortized cost."},
                {"How does " + topic + " maintain structural invariants under high mutation workloads?", "Invariants (such as Red-Black balancing, treeify thresholds, or modCount updates) are validated and restored synchronously during modification passes."},
                {"What are the garbage collection implications of using " + topic + " at large scale?", "Creating millions of wrapper nodes stresses JVM generational GC collectors; prefer array-backed or primitive collections to minimize GC pressure."},
                {"How does " + topic + " resolve pathological hash collision or worst-case scenarios?", "Modern OpenJDK implementations transform degraded O(N) linked list bins into balanced Red-Black trees (O(log N)) when collision thresholds are reached."},
                {"Explain the contract between hashCode(), equals(), and compareTo() within " + topic + ".", "Hash structures enforce hashCode() equality for equal objects; tree structures rely exclusively on compare() == 0, bypassing equals()."},
                {"What concurrency pitfalls exist when reading and writing " + topic + " across threads?", "Race conditions can cause lost updates, stale volatile reads, infinite pointer loops (pre-Java 8), or corrupted internal state."},
                {"How does " + topic + " leverage Java 8+ features (Spliterators, Lambdas, Streams)?", "Exposes custom Spliterators supporting parallel recursive decomposition (trySplit) and internal vectorization optimizations."},
                {"How would you design a custom, low-latency, memory-efficient alternative to " + topic + "?", "Utilize flat primitive arrays, off-heap memory (Unsafe/Foreign Memory API), zero-allocation ring buffers, and cache-aligned structs."}
            };

            for (String[] qa : productQAs) {
                list.add(new InterviewQA("Product-Based", qa[0], qa[1]));
            }

            return list;
        }

        private static List<QuizQuestion> generateQuizzes(String topic) {
            List<QuizQuestion> list = new ArrayList<>();

            for (int i = 1; i <= 7; i++) {
                list.add(new QuizQuestion(
                    "Easy",
                    "[" + topic + " Easy Q" + i + "] Which package contains the core definition of " + topic + "?",
                    List.of("A) java.lang", "B) java.util", "C) java.io", "D) java.net"),
                    'B',
                    topic + " is part of the standard Java Collections Framework located in java.util."
                ));
            }

            for (int i = 1; i <= 7; i++) {
                list.add(new QuizQuestion(
                    "Medium",
                    "[" + topic + " Medium Q" + i + "] What is the typical search time complexity for elements in " + topic + "?",
                    List.of("A) O(1) or O(log n)", "B) O(n^2)", "C) O(n!)", "D) O(2^n)"),
                    'A',
                    topic + " delivers optimized search complexities ranging from O(1) in hash/index structures to O(log n) in balanced search trees."
                ));
            }

            for (int i = 1; i <= 6; i++) {
                list.add(new QuizQuestion(
                    "Hard",
                    "[" + topic + " Hard Q" + i + "] What internal mechanism guarantees consistency during concurrent structural modification in " + topic + "?",
                    List.of("A) volatile lock flags", "B) modCount verification in iterators", "C) Thread.sleep() delays", "D) JVM byte-code rewriting"),
                    'B',
                    topic + " tracking mechanics use an internal modCount field; iterators compare expectedModCount with modCount to trigger fail-fast behavior."
                ));
            }

            return list;
        }
    }

    // =========================================================================
    // LIVE CODING PLAYGROUND ENGINES (EMPTY INIT WITH USER PROMPTS)
    // =========================================================================
    public static final class LivePlayground {
        private final Scanner scanner;

        public LivePlayground(Scanner scanner) {
            this.scanner = scanner;
        }

        public void launch(TopicContent topic) {
            switch (topic.id()) {
                case 1 -> runArrayListPlayground();
                case 2 -> runLinkedListPlayground();
                case 3 -> runHashSetPlayground();
                case 4 -> runTreeSetPlayground();
                case 5 -> runHashMapPlayground();
                case 6 -> runStreamsPlayground();
            }
        }

        private void printExecutionResult(String operation, String complexity, String beforeState, String afterState, String outputNote) {
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("OPERATION      : %s%n", operation));
            sb.append(String.format("COMPLEXITY     : %s%n", complexity));
            sb.append(String.format("STATE (BEFORE) : %s%n", beforeState));
            sb.append(String.format("STATE (AFTER)  : %s%n", afterState));
            sb.append(String.format("STDOUT / RETURN: %s", outputNote));
            UI.printBox(sb.toString());
        }

        private void runArrayListPlayground() {
            List<String> list = new ArrayList<>();
            boolean back = false;

            while (!back) {
                UI.printHeader("LIVE PLAYGROUND: java.util.ArrayList");
                System.out.println("Current Live State : " + list);
                System.out.println("Element Count      : " + list.size());
                System.out.println("\nSelect live operation:");
                System.out.println("  [1] Insertion (add / add at index)");
                System.out.println("  [2] Deletion  (remove by index / remove by value)");
                System.out.println("  [3] Searching (get / contains / indexOf)");
                System.out.println("  [4] Sorting   (Natural Order / Reverse)");
                System.out.println("  [5] Exit Playground");

                int choice = promptInt("\nSelect (1-5): ", 1, 5);
                switch (choice) {
                    case 1 -> {
                        System.out.println("  1. Append: list.add(item)");
                        System.out.println("  2. Positional Insert: list.add(index, item)");
                        int sub = promptInt("Choice (1-2): ", 1, 2);
                        System.out.print("Enter item string: ");
                        String item = scanner.nextLine().trim();
                        String before = list.toString();

                        if (sub == 1) {
                            list.add(item);
                            printExecutionResult("list.add(\"" + item + "\")", "Amortized O(1) [Append]", before, list.toString(), "Appended to index " + (list.size() - 1));
                        } else {
                            int idx = promptInt("Enter index (0 to " + list.size() + "): ", 0, list.size());
                            list.add(idx, item);
                            printExecutionResult("list.add(" + idx + ", \"" + item + "\")", "O(n) [System.arraycopy element right-shift]", before, list.toString(), "Inserted at index " + idx);
                        }
                    }
                    case 2 -> {
                        if (list.isEmpty()) { UI.printWarning("ArrayList is currently empty!"); break; }
                        System.out.println("  1. Remove by index: list.remove(index)");
                        System.out.println("  2. Remove by value: list.remove(value)");
                        int sub = promptInt("Choice (1-2): ", 1, 2);
                        String before = list.toString();

                        if (sub == 1) {
                            int idx = promptInt("Enter index (0 to " + (list.size() - 1) + "): ", 0, list.size() - 1);
                            String removed = list.remove(idx);
                            printExecutionResult("list.remove(" + idx + ")", "O(n) [Left shift & nullify tail]", before, list.toString(), "Removed Element: \"" + removed + "\"");
                        } else {
                            System.out.print("Enter value to remove: ");
                            String val = scanner.nextLine().trim();
                            boolean ok = list.remove(val);
                            printExecutionResult("list.remove(\"" + val + "\")", "O(n) [Linear scan + left shift]", before, list.toString(), "Result: " + ok + (ok ? " (Element unlinked)" : " (Element not found)"));
                        }
                    }
                    case 3 -> {
                        if (list.isEmpty()) { UI.printWarning("ArrayList is currently empty!"); break; }
                        System.out.println("  1. Get by index: list.get(index)");
                        System.out.println("  2. Linear Search: list.contains(value) & indexOf(value)");
                        int sub = promptInt("Choice (1-2): ", 1, 2);
                        String current = list.toString();

                        if (sub == 1) {
                            int idx = promptInt("Enter index (0 to " + (list.size() - 1) + "): ", 0, list.size() - 1);
                            String val = list.get(idx);
                            printExecutionResult("list.get(" + idx + ")", "O(1) [Direct Array Offset]", current, current, "Returned Value: \"" + val + "\"");
                        } else {
                            System.out.print("Enter search value: ");
                            String val = scanner.nextLine().trim();
                            boolean has = list.contains(val);
                            int pos = list.indexOf(val);
                            printExecutionResult("list.contains / indexOf(\"" + val + "\")", "O(n) [Linear elementData traversal]", current, current, "contains: " + has + " | indexOf: " + pos);
                        }
                    }
                    case 4 -> {
                        if (list.isEmpty()) { UI.printWarning("ArrayList is currently empty!"); break; }
                        System.out.println("  1. Natural Ascending: list.sort(Comparator.naturalOrder())");
                        System.out.println("  2. Reverse Descending: list.sort(Comparator.reverseOrder())");
                        int sub = promptInt("Choice (1-2): ", 1, 2);
                        String before = list.toString();

                        if (sub == 1) {
                            list.sort(Comparator.naturalOrder());
                            printExecutionResult("list.sort(naturalOrder())", "O(n log n) [Dual-Pivot Timsort]", before, list.toString(), "Array reordered in-place");
                        } else {
                            list.sort(Comparator.reverseOrder());
                            printExecutionResult("list.sort(reverseOrder())", "O(n log n) [Dual-Pivot Timsort]", before, list.toString(), "Array reordered in-place");
                        }
                    }
                    case 5 -> back = true;
                }
                if (!back) pressEnterToContinue();
            }
        }

        private void runLinkedListPlayground() {
            LinkedList<String> list = new LinkedList<>();
            boolean back = false;

            while (!back) {
                UI.printHeader("LIVE PLAYGROUND: java.util.LinkedList (Deque / Queue)");
                System.out.println("Current Live State : [HEAD] " + list + " [TAIL]");
                System.out.println("Node Count         : " + list.size());
                System.out.println("\nSelect live operation:");
                System.out.println("  [1] Insertion (addFirst / addLast / add at index)");
                System.out.println("  [2] Deletion  (removeFirst / removeLast / remove value)");
                System.out.println("  [3] Searching (getFirst / getLast / get(i))");
                System.out.println("  [4] Sorting   (Timsort via Array Conversion)");
                System.out.println("  [5] Exit Playground");

                int choice = promptInt("\nSelect (1-5): ", 1, 5);
                switch (choice) {
                    case 1 -> {
                        System.out.println("  1. addFirst(val)");
                        System.out.println("  2. addLast(val)");
                        System.out.println("  3. add(index, val)");
                        int sub = promptInt("Choice (1-3): ", 1, 3);
                        System.out.print("Enter string value: ");
                        String val = scanner.nextLine().trim();
                        String before = list.toString();

                        if (sub == 1) {
                            list.addFirst(val);
                            printExecutionResult("list.addFirst(\"" + val + "\")", "O(1) [linkFirst pointer rewire]", before, list.toString(), "New head attached");
                        } else if (sub == 2) {
                            list.addLast(val);
                            printExecutionResult("list.addLast(\"" + val + "\")", "O(1) [linkLast pointer rewire]", before, list.toString(), "New tail attached");
                        } else {
                            int idx = promptInt("Enter index (0 to " + list.size() + "): ", 0, list.size());
                            list.add(idx, val);
                            printExecutionResult("list.add(" + idx + ", \"" + val + "\")", "O(n) [Traverse n/2 nodes + linkBefore]", before, list.toString(), "Node spliced at index " + idx);
                        }
                    }
                    case 2 -> {
                        if (list.isEmpty()) { UI.printWarning("LinkedList is empty!"); break; }
                        System.out.println("  1. removeFirst()");
                        System.out.println("  2. removeLast()");
                        System.out.println("  3. remove(val)");
                        int sub = promptInt("Choice (1-3): ", 1, 3);
                        String before = list.toString();

                        if (sub == 1) {
                            String rem = list.removeFirst();
                            printExecutionResult("list.removeFirst()", "O(1) [unlinkFirst]", before, list.toString(), "Detached Node: \"" + rem + "\"");
                        } else if (sub == 2) {
                            String rem = list.removeLast();
                            printExecutionResult("list.removeLast()", "O(1) [unlinkLast]", before, list.toString(), "Detached Node: \"" + rem + "\"");
                        } else {
                            System.out.print("Enter value to remove: ");
                            String target = scanner.nextLine().trim();
                            boolean ok = list.remove(target);
                            printExecutionResult("list.remove(\"" + target + "\")", "O(n) [Linear pointer scan + unlink]", before, list.toString(), "Result: " + ok);
                        }
                    }
                    case 3 -> {
                        if (list.isEmpty()) { UI.printWarning("LinkedList is empty!"); break; }
                        System.out.println("  1. getFirst() / peekFirst()");
                        System.out.println("  2. getLast()  / peekLast()");
                        System.out.println("  3. get(index)");
                        int sub = promptInt("Choice (1-3): ", 1, 3);
                        String current = list.toString();

                        if (sub == 1) {
                            printExecutionResult("list.getFirst()", "O(1) [Direct head pointer]", current, current, "Head: \"" + list.getFirst() + "\"");
                        } else if (sub == 2) {
                            printExecutionResult("list.getLast()", "O(1) [Direct tail pointer]", current, current, "Tail: \"" + list.getLast() + "\"");
                        } else {
                            int idx = promptInt("Enter index (0 to " + (list.size() - 1) + "): ", 0, list.size() - 1);
                            printExecutionResult("list.get(" + idx + ")", "O(n) [Bidirectional search (n/2 steps max)]", current, current, "Value at index " + idx + ": \"" + list.get(idx) + "\"");
                        }
                    }
                    case 4 -> {
                        if (list.isEmpty()) { UI.printWarning("LinkedList is empty!"); break; }
                        String before = list.toString();
                        list.sort(Comparator.naturalOrder());
                        printExecutionResult("list.sort(naturalOrder())", "O(n log n) [toArray() -> Timsort -> Node rewiring]", before, list.toString(), "Nodes reordered");
                    }
                    case 5 -> back = true;
                }
                if (!back) pressEnterToContinue();
            }
        }

        private void runHashSetPlayground() {
            Set<String> set = new HashSet<>();
            boolean back = false;

            while (!back) {
                UI.printHeader("LIVE PLAYGROUND: java.util.HashSet (Unique Hash Table)");
                System.out.println("Current Live State : " + set);
                System.out.println("Bucket Size        : " + set.size());
                System.out.println("\nSelect live operation:");
                System.out.println("  [1] Insertion (add element)");
                System.out.println("  [2] Deletion  (remove element)");
                System.out.println("  [3] Searching (contains membership test)");
                System.out.println("  [4] Sorting   (Extract to sorted structure)");
                System.out.println("  [5] Exit Playground");

                int choice = promptInt("\nSelect (1-5): ", 1, 5);
                switch (choice) {
                    case 1 -> {
                        System.out.print("Enter string element: ");
                        String val = scanner.nextLine().trim();
                        String before = set.toString();
                        boolean added = set.add(val);
                        printExecutionResult("set.add(\"" + val + "\")", "O(1) Avg [Hash calculation: (n - 1) & hash]", before, set.toString(), "Returned: " + added + (added ? " (Inserted to bucket)" : " (Duplicate rejected)"));
                    }
                    case 2 -> {
                        if (set.isEmpty()) { UI.printWarning("HashSet is currently empty!"); break; }
                        System.out.print("Enter string to remove: ");
                        String val = scanner.nextLine().trim();
                        String before = set.toString();
                        boolean ok = set.remove(val);
                        printExecutionResult("set.remove(\"" + val + "\")", "O(1) Avg [Bucket lookup & unlink]", before, set.toString(), "Returned: " + ok);
                    }
                    case 3 -> {
                        if (set.isEmpty()) { UI.printWarning("HashSet is currently empty!"); break; }
                        System.out.print("Enter search key: ");
                        String val = scanner.nextLine().trim();
                        String current = set.toString();
                        boolean has = set.contains(val);
                        printExecutionResult("set.contains(\"" + val + "\")", "O(1) Avg [key.hashCode() + key.equals()]", current, current, "Membership Check: " + has);
                    }
                    case 4 -> {
                        if (set.isEmpty()) { UI.printWarning("HashSet is currently empty!"); break; }
                        String current = set.toString();
                        List<String> sorted = new ArrayList<>(set);
                        Collections.sort(sorted);
                        printExecutionResult("Collections.sort(new ArrayList<>(set))", "O(n log n) [External Sort]", current, current, "Sorted View: " + sorted);
                    }
                    case 5 -> back = true;
                }
                if (!back) pressEnterToContinue();
            }
        }

        private void runTreeSetPlayground() {
            NavigableSet<Integer> set = new TreeSet<>();
            boolean back = false;

            while (!back) {
                UI.printHeader("LIVE PLAYGROUND: java.util.TreeSet (Red-Black BST)");
                System.out.println("Current Live State : " + set + " (In-Order Traversal)");
                System.out.println("Tree Node Count    : " + set.size());
                System.out.println("\nSelect live operation:");
                System.out.println("  [1] Insertion (add integer)");
                System.out.println("  [2] Deletion  (remove integer)");
                System.out.println("  [3] Searching (contains / floor / ceiling / lower / higher)");
                System.out.println("  [4] Sorting   (In-order vs Descending View)");
                System.out.println("  [5] Exit Playground");

                int choice = promptInt("\nSelect (1-5): ", 1, 5);
                switch (choice) {
                    case 1 -> {
                        int num = promptInt("Enter integer to insert: ", -100000, 100000);
                        String before = set.toString();
                        boolean ok = set.add(num);
                        printExecutionResult("set.add(" + num + ")", "O(log n) [BST traversal + Color fix / Rotations]", before, set.toString(), "Returned: " + ok + (ok ? " (Node attached)" : " (Duplicate: compareTo == 0)"));
                    }
                    case 2 -> {
                        if (set.isEmpty()) { UI.printWarning("TreeSet is currently empty!"); break; }
                        int num = promptInt("Enter integer to remove: ", -100000, 100000);
                        String before = set.toString();
                        boolean ok = set.remove(num);
                        printExecutionResult("set.remove(" + num + ")", "O(log n) [In-order successor replace & rebalance]", before, set.toString(), "Returned: " + ok);
                    }
                    case 3 -> {
                        if (set.isEmpty()) { UI.printWarning("TreeSet is currently empty!"); break; }
                        System.out.println("  1. contains(x)");
                        System.out.println("  2. floor(x)   [<= x]");
                        System.out.println("  3. ceiling(x) [>= x]");
                        System.out.println("  4. lower(x)   [< x]");
                        System.out.println("  5. higher(x)  [> x]");
                        int sub = promptInt("Choice (1-5): ", 1, 5);
                        int num = promptInt("Enter target value: ", -100000, 100000);
                        String current = set.toString();

                        switch (sub) {
                            case 1 -> printExecutionResult("set.contains(" + num + ")", "O(log n) [Binary Branching]", current, current, "Result: " + set.contains(num));
                            case 2 -> printExecutionResult("set.floor(" + num + ")", "O(log n) [Branch boundary search]", current, current, "Greatest element <= " + num + ": " + set.floor(num));
                            case 3 -> printExecutionResult("set.ceiling(" + num + ")", "O(log n) [Branch boundary search]", current, current, "Least element >= " + num + ": " + set.ceiling(num));
                            case 4 -> printExecutionResult("set.lower(" + num + ")", "O(log n) [Strict lower candidate]", current, current, "Greatest element < " + num + ": " + set.lower(num));
                            case 5 -> printExecutionResult("set.higher(" + num + ")", "O(log n) [Strict higher candidate]", current, current, "Least element > " + num + ": " + set.higher(num));
                        }
                    }
                    case 4 -> {
                        if (set.isEmpty()) { UI.printWarning("TreeSet is currently empty!"); break; }
                        String current = set.toString();
                        printExecutionResult("set.descendingSet()", "O(1) [Reverse NavigableSet View Wrapper]", current, current, "Ascending: " + set + "\nDescending: " + set.descendingSet());
                    }
                    case 5 -> back = true;
                }
                if (!back) pressEnterToContinue();
            }
        }

        private void runHashMapPlayground() {
            Map<String, Integer> map = new HashMap<>();
            boolean back = false;

            while (!back) {
                UI.printHeader("LIVE PLAYGROUND: java.util.HashMap (Associative Table)");
                System.out.println("Current Live State : " + map);
                System.out.println("Entry Count        : " + map.size());
                System.out.println("\nSelect live operation:");
                System.out.println("  [1] Insertion (put / putIfAbsent)");
                System.out.println("  [2] Deletion  (remove by key)");
                System.out.println("  [3] Searching (get / containsKey / containsValue)");
                System.out.println("  [4] Sorting   (Sort by Key vs Sort by Value)");
                System.out.println("  [5] Exit Playground");

                int choice = promptInt("\nSelect (1-5): ", 1, 5);
                switch (choice) {
                    case 1 -> {
                        System.out.print("Enter Key (e.g. USD): ");
                        String key = scanner.nextLine().trim();
                        int val = promptInt("Enter Value integer: ", -100000, 100000);
                        String before = map.toString();
                        Integer old = map.put(key, val);
                        printExecutionResult("map.put(\"" + key + "\", " + val + ")", "O(1) Avg [Hash Bitmask (n-1)&hash]", before, map.toString(), "Previous Value: " + old + (old == null ? " (New Key Assigned)" : " (Value Updated)"));
                    }
                    case 2 -> {
                        if (map.isEmpty()) { UI.printWarning("HashMap is currently empty!"); break; }
                        System.out.print("Enter Key to remove: ");
                        String key = scanner.nextLine().trim();
                        String before = map.toString();
                        Integer old = map.remove(key);
                        printExecutionResult("map.remove(\"" + key + "\")", "O(1) Avg [Bucket lookup + node detachment]", before, map.toString(), "Removed Value: " + old);
                    }
                    case 3 -> {
                        if (map.isEmpty()) { UI.printWarning("HashMap is currently empty!"); break; }
                        System.out.print("Enter Key to query: ");
                        String key = scanner.nextLine().trim();
                        String current = map.toString();
                        boolean hasK = map.containsKey(key);
                        Integer val = map.get(key);
                        printExecutionResult("map.get(\"" + key + "\") / containsKey", "O(1) Avg [Key Bitmask]", current, current, "containsKey: " + hasK + " | get(key): " + val);
                    }
                    case 4 -> {
                        if (map.isEmpty()) { UI.printWarning("HashMap is currently empty!"); break; }
                        String current = map.toString();
                        Map<String, Integer> sortedByKey = new TreeMap<>(map);
                        List<Map.Entry<String, Integer>> sortedByVal = map.entrySet().stream()
                            .sorted(Map.Entry.comparingByValue())
                            .toList();
                        printExecutionResult("Sorting Map (Keys vs Values)", "O(n log n)", current, current, "Key Sorted (TreeMap)  : " + sortedByKey + "\nValue Sorted (Streams) : " + sortedByVal);
                    }
                    case 5 -> back = true;
                }
                if (!back) pressEnterToContinue();
            }
        }

        private void runStreamsPlayground() {
            List<Integer> numbers = promptUserForNumbers();
            boolean back = false;

            while (!back) {
                UI.printHeader("LIVE PLAYGROUND: java.util.stream.Stream Pipeline");
                System.out.println("Source Collection  : " + numbers);
                System.out.println("Element Count      : " + numbers.size());
                System.out.println("\nSelect live pipeline operation:");
                System.out.println("  [1] Pipeline Filtering (Intermediate filter(n -> n > X))");
                System.out.println("  [2] Pipeline Mapping   (Intermediate map(n -> n * X))");
                System.out.println("  [3] Short-Circuit Search (Terminal findFirst / anyMatch)");
                System.out.println("  [4] Pipeline Sorting   (Stateful Intermediate sorted())");
                System.out.println("  [5] Reset Input Numbers");
                System.out.println("  [6] Exit Playground");

                int choice = promptInt("\nSelect (1-6): ", 1, 6);
                switch (choice) {
                    case 1 -> {
                        int threshold = promptInt("Filter numbers strictly greater than: ", -100000, 100000);
                        String current = numbers.toString();
                        List<Integer> filtered = numbers.stream().filter(n -> n > threshold).toList();
                        printExecutionResult("numbers.stream().filter(n -> n > " + threshold + ").toList()", "O(n) [Stateless Intermediate Pipeline]", current, current, "Emitted Pipeline Output: " + filtered);
                    }
                    case 2 -> {
                        int multiplier = promptInt("Multiply each element by factor: ", -100, 100);
                        String current = numbers.toString();
                        List<Integer> mapped = numbers.stream().map(n -> n * multiplier).toList();
                        printExecutionResult("numbers.stream().map(n -> n * " + multiplier + ").toList()", "O(n) [Lazy Element Transformation]", current, current, "Emitted Pipeline Output: " + mapped);
                    }
                    case 3 -> {
                        int matchVal = promptInt("Test if any element equals: ", -100000, 100000);
                        String current = numbers.toString();
                        boolean any = numbers.stream().anyMatch(n -> n == matchVal);
                        Optional<Integer> firstEven = numbers.stream().filter(n -> n % 2 == 0).findFirst();
                        printExecutionResult("Pipeline Short-Circuit Evaluation", "O(1) to O(n) [Short-circuits upon match]", current, current, "anyMatch(n == " + matchVal + "): " + any + "\nfindFirst() even number: " + firstEven.orElse(null));
                    }
                    case 4 -> {
                        String current = numbers.toString();
                        List<Integer> sorted = numbers.stream().sorted().toList();
                        List<Integer> revSorted = numbers.stream().sorted(Comparator.reverseOrder()).toList();
                        printExecutionResult("stream().sorted()", "O(n log n) [Stateful Intermediate Barrier]", current, current, "Ascending Stream : " + sorted + "\nDescending Stream: " + revSorted);
                    }
                    case 5 -> numbers = promptUserForNumbers();
                    case 6 -> back = true;
                }
                if (!back) pressEnterToContinue();
            }
        }

        private List<Integer> promptUserForNumbers() {
            while (true) {
                System.out.print("\nEnter space- or comma-separated integers for your stream source: ");
                String input = scanner.nextLine().trim();
                if (input.isEmpty()) {
                    UI.printWarning("Please provide at least one integer.");
                    continue;
                }
                String[] tokens = input.split("[,\\s]+");
                List<Integer> nums = new ArrayList<>();
                boolean valid = true;
                for (String t : tokens) {
                    try {
                        nums.add(Integer.parseInt(t));
                    } catch (NumberFormatException e) {
                        UI.printError("Invalid integer token: '" + t + "'");
                        valid = false;
                        break;
                    }
                }
                if (valid && !nums.isEmpty()) {
                    return nums;
                }
            }
        }

        private int promptInt(String prompt, int min, int max) {
            while (true) {
                System.out.print(prompt);
                String input = scanner.nextLine().trim();
                try {
                    int val = Integer.parseInt(input);
                    if (val >= min && val <= max) return val;
                    UI.printWarning("Enter a number between " + min + " and " + max + ".");
                } catch (NumberFormatException e) {
                    UI.printError("Invalid integer input.");
                }
            }
        }

        private void pressEnterToContinue() {
            System.out.print("\nPress [ENTER] to continue...");
            scanner.nextLine();
        }
    }

    // =========================================================================
    // CONTROLLER & APPLICATION WORKFLOW
    // =========================================================================
    public static final class Controller {
        private final Scanner scanner = new Scanner(System.in);
        private final LivePlayground playground = new LivePlayground(scanner);

        public void run() {
            boolean exitApp = false;
            while (!exitApp) {
                UI.printHeader("JAVA COLLECTIONS & STREAMS MASTERY CLI");
                System.out.println("Select a topic, matrix, or global tool:");

                MasteryRepository.getAllTopics().forEach((id, topic) -> {
                    System.out.printf("  [%d] %s%n", id, topic.title());
                });
                System.out.println("  [7] Collections Comparison Hub (Matrix, Face-Offs & Decision Guide)");
                System.out.println("  [8] Global Collections Hierarchy Mind Map");
                System.out.println("  [9] Exit Application");

                int choice = promptInt("\nEnter selection (1-9): ", 1, 9);
                switch (choice) {
                    case 9 -> {
                        exitApp = true;
                        UI.printSuccess("Exiting Java Mastery CLI. Happy Coding!");
                    }
                    case 7 -> handleComparisonHub();
                    case 8 -> renderGlobalMindMap();
                    default -> handleSubMenu(MasteryRepository.getTopic(choice));
                }
            }
        }

        private void handleComparisonHub() {
            boolean back = false;
            while (!back) {
                UI.printHeader("JAVA COLLECTIONS COMPARISON & DECISION HUB");
                System.out.println("Choose a comparative analysis:");
                System.out.println("  [1] Master Comparison Table (All Collections)");
                System.out.println("  [2] Face-Off: ArrayList vs LinkedList");
                System.out.println("  [3] Face-Off: HashSet vs TreeSet");
                System.out.println("  [4] Face-Off: HashMap vs TreeMap vs ConcurrentHashMap");
                System.out.println("  [5] Face-Off: Collections Framework vs Java Streams");
                System.out.println("  [6] Decision Matrix Guide (Which to Use When)");
                System.out.println("  [7] Return to Main Menu");

                int choice = promptInt("\nEnter selection (1-7): ", 1, 7);
                switch (choice) {
                    case 1 -> {
                        UI.printHeader("MASTER ARCHITECTURAL COMPARISON MATRIX");
                        System.out.println(MasteryRepository.getMasterComparisonMatrix());
                        pressEnterToContinue();
                    }
                    case 2 -> {
                        UI.printHeader("ARCHITECTURAL FACE-OFF: ARRAYLIST vs LINKEDLIST");
                        System.out.println(MasteryRepository.getArrayListVsLinkedListComparison());
                        pressEnterToContinue();
                    }
                    case 3 -> {
                        UI.printHeader("ARCHITECTURAL FACE-OFF: HASHSET vs TREESET");
                        System.out.println(MasteryRepository.getHashSetVsTreeSetComparison());
                        pressEnterToContinue();
                    }
                    case 4 -> {
                        UI.printHeader("ARCHITECTURAL FACE-OFF: MAP IMPLEMENTATIONS");
                        System.out.println(MasteryRepository.getHashMapVsTreeMapVsConcurrentMapComparison());
                        pressEnterToContinue();
                    }
                    case 5 -> {
                        UI.printHeader("ARCHITECTURAL FACE-OFF: COLLECTIONS vs STREAMS");
                        System.out.println(MasteryRepository.getCollectionVsStreamsComparison());
                        pressEnterToContinue();
                    }
                    case 6 -> {
                        UI.printHeader("ARCHITECTURAL DECISION MATRIX");
                        System.out.println(MasteryRepository.getDecisionMatrixGuide());
                        pressEnterToContinue();
                    }
                    case 7 -> back = true;
                }
            }
        }

        private void renderGlobalMindMap() {
            UI.printHeader("GLOBAL JAVA COLLECTIONS FRAMEWORK MIND MAP");
            System.out.println(MasteryRepository.getMasterCollectionsMindMap());
            pressEnterToContinue();
        }

        private void handleSubMenu(TopicContent topic) {
            boolean back = false;
            while (!back) {
                UI.printHeader(topic.title().toUpperCase() + " MASTERY MODULE");
                System.out.println("Choose an inspection submodule:");
                System.out.println("  [1] Architectural Mind Map");
                System.out.println("  [2] Deep Architecture, Operations & Complexities");
                System.out.println("  [3] Live Interactive Coding Sandbox (Playground)");
                System.out.println("  [4] Real-World Industry Use Cases (20 Scenarios)");
                System.out.println("  [5] Technical Interview Questions (20 Q&As: Service vs Product)");
                System.out.println("  [6] Interactive Knowledge Evaluation Quiz (20 Quizzes)");
                System.out.println("  [7] Return to Main Menu");

                int choice = promptInt("\nEnter selection (1-7): ", 1, 7);
                switch (choice) {
                    case 1 -> renderTopicMindMap(topic);
                    case 2 -> handleExplanationMenu(topic);
                    case 3 -> playground.launch(topic);
                    case 4 -> renderRealWorld(topic);
                    case 5 -> renderInterviewQA(topic);
                    case 6 -> runQuiz(topic);
                    case 7 -> back = true;
                }
            }
        }

        private void renderTopicMindMap(TopicContent topic) {
            UI.printHeader(topic.title() + " - Architectural Mind Map");
            System.out.println(topic.topicMindMap());
            pressEnterToContinue();
        }

        private void handleExplanationMenu(TopicContent topic) {
            boolean back = false;
            while (!back) {
                UI.printHeader(topic.title() + " - Deep Architecture & Operations Menu");
                System.out.println("Select section to study:");
                System.out.println("  [1] Definition, Key Points, Architecture, Syntax, Advantages & Disadvantages");
                System.out.println("  [2] Operations Deep Dive (Insertion, Deletion, Searching, Sorting - Working & Syntax)");
                System.out.println("  [3] Back to Submenu");

                int choice = promptInt("\nEnter selection (1-3): ", 1, 3);
                switch (choice) {
                    case 1 -> renderArchitectureOverview(topic);
                    case 2 -> renderOperationsDeepDive(topic);
                    case 3 -> back = true;
                }
            }
        }

        private void renderArchitectureOverview(TopicContent topic) {
            ArchitectureData arch = topic.explanation().architectureOverview();
            UI.printHeader(topic.title() + " - Overview & Architecture");

            UI.printSection("1. Definition");
            System.out.println(arch.definition());

            UI.printSection("2. Core Architecture & Internal Engine");
            System.out.println(arch.coreArchitecture());

            UI.printSection("3. Key Characteristics");
            arch.keyPoints().forEach(point -> System.out.println("  * " + point));

            UI.printSection("4. Basic Syntax Demonstration");
            UI.printBox(arch.basicSyntax().trim());

            UI.printSection("5. Advantages");
            arch.advantages().forEach(adv -> System.out.println("  [+] " + adv));

            UI.printSection("6. Disadvantages & Trade-offs");
            arch.disadvantages().forEach(dis -> System.out.println("  [-] " + dis));

            pressEnterToContinue();
        }

        private void renderOperationsDeepDive(TopicContent topic) {
            UI.printHeader(topic.title() + " - Core Operations Deep Dive");
            List<OperationDeepDive> ops = topic.explanation().operations();

            for (OperationDeepDive op : ops) {
                UI.printSection("Operation: " + op.name());
                System.out.println("Time Complexity  : " + op.timeComplexity());
                System.out.println("Space Complexity : " + op.spaceComplexity());

                System.out.println("\nSyntax Example:");
                UI.printBox(op.syntax().trim());

                System.out.println("\nInternal Working & Mechanics:");
                System.out.println(op.internalWorking());

                System.out.println("\nStep-by-Step Breakdown:");
                op.keyMechanics().forEach(step -> System.out.println("  -> " + step));
                System.out.println();
            }

            pressEnterToContinue();
        }

        private void renderRealWorld(TopicContent topic) {
            UI.printHeader(topic.title() + " - 20 Real-World Production Scenarios");
            List<RealWorldScenario> list = topic.realWorldScenarios();
            int pageSize = 5;
            for (int i = 0; i < list.size(); i++) {
                RealWorldScenario s = list.get(i);
                UI.printSection("Scenario " + (i + 1) + ": " + s.domain());
                System.out.println("Business Problem : " + s.problem());
                System.out.println("Solution & Impact: " + s.solutionRationale());

                if ((i + 1) % pageSize == 0 && (i + 1) < list.size()) {
                    System.out.println("\n--- Showing " + (i + 1) + " of " + list.size() + " scenarios ---");
                    pressEnterToContinue();
                }
            }
            pressEnterToContinue();
        }

        private void renderInterviewQA(TopicContent topic) {
            UI.printHeader(topic.title() + " - 20 Frequently Asked Interview Questions");

            UI.printSection("Tier 1: Service-Based Enterprise Questions (10 Questions)");
            List<InterviewQA> serviceQAs = topic.interviewQAs().stream()
                .filter(qa -> qa.companyCategory().equalsIgnoreCase("Service-Based"))
                .toList();

            for (int i = 0; i < serviceQAs.size(); i++) {
                displayQA(i + 1, serviceQAs.get(i));
            }

            pressEnterToContinue();

            UI.printSection("Tier 2: Product-Based Tech Questions (10 Questions)");
            List<InterviewQA> productQAs = topic.interviewQAs().stream()
                .filter(qa -> qa.companyCategory().equalsIgnoreCase("Product-Based"))
                .toList();

            for (int i = 0; i < productQAs.size(); i++) {
                displayQA(i + 1, productQAs.get(i));
            }

            pressEnterToContinue();
        }

        private void displayQA(int index, InterviewQA qa) {
            System.out.println("\nQ" + index + ": " + qa.question());
            System.out.println("Answer: " + qa.modelAnswer());
        }

        private void runQuiz(TopicContent topic) {
            UI.printHeader(topic.title() + " - Interactive Mastery Quiz (20 Questions)");
            int score = 0;
            List<QuizQuestion> pool = topic.quizPool();

            for (int i = 0; i < pool.size(); i++) {
                QuizQuestion q = pool.get(i);
                System.out.println("\nQuestion " + (i + 1) + " of " + pool.size() + " [" + q.difficulty() + " Tier]");
                System.out.println(q.question());
                q.options().forEach(opt -> System.out.println("  " + opt));

                char userAns = promptOption("Your choice (A, B, C, D): ");
                if (userAns == q.correctOption()) {
                    UI.printSuccess("CORRECT!");
                    score++;
                } else {
                    UI.printError("INCORRECT! Correct Answer was: [" + q.correctOption() + "]");
                }
                System.out.println("Deep Explanation: " + q.explanation());

                if ((i + 1) % 5 == 0 && (i + 1) < pool.size()) {
                    System.out.println("\n--- Current Score: " + score + "/" + (i + 1) + " ---");
                    pressEnterToContinue();
                }
            }

            UI.printSection("Quiz Complete");
            double percentage = ((double) score / pool.size()) * 100;
            System.out.printf("Final Result: %d / %d (%.1f%%)%n", score, pool.size(), percentage);
            pressEnterToContinue();
        }

        private int promptInt(String prompt, int min, int max) {
            while (true) {
                System.out.print(prompt);
                String input = scanner.nextLine().trim();
                try {
                    int val = Integer.parseInt(input);
                    if (val >= min && val <= max) return val;
                    UI.printWarning("Please enter a valid number between " + min + " and " + max + ".");
                } catch (NumberFormatException e) {
                    UI.printError("Invalid input. Please enter a valid integer.");
                }
            }
        }

        private char promptOption(String prompt) {
            while (true) {
                System.out.print(prompt);
                String input = scanner.nextLine().trim().toUpperCase();
                if (input.length() == 1 && input.charAt(0) >= 'A' && input.charAt(0) <= 'D') {
                    return input.charAt(0);
                }
                UI.printWarning("Invalid selection. Please enter A, B, C, or D.");
            }
        }

        private void pressEnterToContinue() {
            System.out.print("\nPress [ENTER] to continue...");
            scanner.nextLine();
        }
    }

    // =========================================================================
    // ENTRY POINT
    // =========================================================================
    public static void main(String[] args) {
        new Controller().run();
    }
}

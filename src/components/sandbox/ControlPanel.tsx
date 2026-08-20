import React, { useState } from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { Play, Plus, Trash2, RotateCcw, Shuffle, Sparkles, Filter, Sliders } from 'lucide-react';

export const ControlPanel: React.FC = () => {
  const {
    activeTopic,
    arrayListState,
    linkedListState,
    hashSetState,
    treeSetState,
    hashMapState,
    streamsState,
    updateArrayList,
    updateLinkedList,
    updateHashSet,
    updateTreeSet,
    updateHashMap,
    updateStreams,
    addTelemetryLog
  } = useMasteryStore();

  // Local Form Inputs
  const [inputVal, setInputVal] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [inputIdx, setInputIdx] = useState<number>(0);
  const [filterThreshold, setFilterThreshold] = useState<number>(20);
  const [mapFactor, setMapFactor] = useState<number>(2);

  // Helper for telemetry dispatch
  const logOp = (
    op: string,
    timeComp: string,
    spaceComp: string,
    before: string,
    after: string,
    jvmBytes: number,
    locality: 'High (L1/L2)' | 'Moderate' | 'Low (Pointer Chasing)',
    gc: 'None (In-Place)' | 'Low (Wrapper Node)' | 'High (Resizing Copy)',
    out: string,
    steps?: string[]
  ) => {
    addTelemetryLog(activeTopic, {
      timestamp: new Date().toLocaleTimeString(),
      operation: op,
      timeComplexity: timeComp,
      spaceComplexity: spaceComp,
      beforeState: before,
      afterState: after,
      jvmBytesAllocated: jvmBytes,
      cacheLocalityScore: locality,
      gcPressure: gc,
      output: out,
      stepDetails: steps
    });
  };

  // ARRAYLIST ACTIONS
  const handleArrayList = (action: 'add' | 'insert' | 'removeIdx' | 'removeVal' | 'get' | 'sort' | 'clear' | 'sample') => {
    const { items, capacity } = arrayListState;
    const before = JSON.stringify(items);

    if (action === 'add') {
      const val = inputVal.trim() || `Item-${items.length + 1}`;
      const newItems = [...items, val];
      let newCapacity = capacity;
      let isGrowing = false;
      let growFrom = capacity;
      let growTo = capacity;

      if (newItems.length > capacity) {
        newCapacity = capacity + (capacity >> 1); // 1.5x
        isGrowing = true;
        growFrom = capacity;
        growTo = newCapacity;
      }

      updateArrayList(() => ({
        items: newItems,
        capacity: newCapacity,
        highlightIndex: newItems.length - 1,
        shiftedIndices: [],
        isGrowing,
        growFrom,
        growTo
      }));

      logOp(
        `list.add("${val}")`,
        isGrowing ? 'O(n) [Resize 1.5x]' : 'Amortized O(1) [Append]',
        isGrowing ? `+${(newCapacity - capacity) * 4}B` : 'O(1)',
        before,
        JSON.stringify(newItems),
        isGrowing ? newCapacity * 4 + 32 : 4,
        'High (L1/L2)',
        isGrowing ? 'High (Resizing Copy)' : 'None (In-Place)',
        `Appended "${val}" at index ${newItems.length - 1}${isGrowing ? ` (Capacity expanded to ${newCapacity})` : ''}`,
        ['Checked ensureCapacityInternal(size + 1)', 'Assigned elementData[size++] = element', 'Incremented modCount']
      );
      setInputVal('');
    } else if (action === 'insert') {
      const idx = Math.max(0, Math.min(items.length, inputIdx));
      const val = inputVal.trim() || `Inserted-${idx}`;
      const newItems = [...items];
      newItems.splice(idx, 0, val);
      let newCapacity = capacity;
      let isGrowing = false;

      if (newItems.length > capacity) {
        newCapacity = capacity + (capacity >> 1);
        isGrowing = true;
      }

      const shifted = Array.from({ length: items.length - idx }, (_, i) => idx + i + 1);

      updateArrayList(() => ({
        items: newItems,
        capacity: newCapacity,
        highlightIndex: idx,
        shiftedIndices: shifted,
        isGrowing
      }));

      logOp(
        `list.add(${idx}, "${val}")`,
        'O(n) [System.arraycopy Shift]',
        'O(1) aux',
        before,
        JSON.stringify(newItems),
        4,
        'High (L1/L2)',
        'None (In-Place)',
        `Inserted "${val}" at index ${idx}. Shifted ${items.length - idx} elements right via native arraycopy.`,
        ['Executed rangeCheckForAdd(index)', 'Vectorized shift via System.arraycopy', 'Assigned elementData[index] = element']
      );
      setInputVal('');
    } else if (action === 'removeIdx') {
      if (inputIdx < 0 || inputIdx >= items.length) return;
      const newItems = [...items];
      const removed = newItems.splice(inputIdx, 1)[0];
      const shifted = Array.from({ length: items.length - inputIdx - 1 }, (_, i) => inputIdx + i);

      updateArrayList(() => ({
        items: newItems,
        highlightIndex: null,
        shiftedIndices: shifted
      }));

      logOp(
        `list.remove(${inputIdx})`,
        'O(n) [Left Shift & Nullify]',
        'O(1) aux',
        before,
        JSON.stringify(newItems),
        0,
        'High (L1/L2)',
        'None (In-Place)',
        `Removed "${removed}" at index ${inputIdx}. Trailing slot set to null for immediate GC.`,
        ['Saved oldValue', 'Shifted elements left via System.arraycopy', 'Explicitly executed elementData[--size] = null']
      );
    } else if (action === 'get') {
      if (inputIdx < 0 || inputIdx >= items.length) return;
      updateArrayList(() => ({ highlightIndex: inputIdx, shiftedIndices: [] }));
      logOp(
        `list.get(${inputIdx})`,
        'O(1) [Direct Offset]',
        'O(1)',
        before,
        before,
        0,
        'High (L1/L2)',
        'None (In-Place)',
        `Direct read Base + (${inputIdx} * 4B) -> "${items[inputIdx]}"`
      );
    } else if (action === 'sort') {
      const newItems = [...items].sort();
      updateArrayList(() => ({ items: newItems, highlightIndex: null, shiftedIndices: [] }));
      logOp(
        'list.sort(Comparator.naturalOrder())',
        'O(n log n) [Dual-Pivot Timsort]',
        'O(n) temp buffer',
        before,
        JSON.stringify(newItems),
        items.length * 4,
        'High (L1/L2)',
        'None (In-Place)',
        'Sorted contiguous array in-place via Adaptive Timsort'
      );
    } else if (action === 'sample') {
      const samples = ['Microservice', 'Cloud', 'Kubernetes', 'DevOps', 'Database', 'Cache'];
      updateArrayList(() => ({ items: samples, capacity: 10, highlightIndex: null, shiftedIndices: [] }));
      logOp('list.addAll(samples)', 'O(k)', 'O(k)', before, JSON.stringify(samples), samples.length * 4, 'High (L1/L2)', 'None (In-Place)', 'Loaded sample enterprise production stack');
    } else if (action === 'clear') {
      updateArrayList(() => ({ items: [], capacity: 10, highlightIndex: null, shiftedIndices: [] }));
      logOp('list.clear()', 'O(n) [Traverse & Nullify]', 'O(1)', before, '[]', 0, 'High (L1/L2)', 'None (In-Place)', 'All array slots set to null, size = 0');
    }
  };

  // LINKEDLIST ACTIONS
  const handleLinkedList = (action: 'addFirst' | 'addLast' | 'removeFirst' | 'removeLast' | 'peek' | 'sort' | 'clear' | 'sample') => {
    const { nodes } = linkedListState;
    const before = JSON.stringify(nodes.map(n => n.val));

    if (action === 'addFirst') {
      const val = inputVal.trim() || `Head-${nodes.length + 1}`;
      const newNode = { id: 'n_' + Math.random().toString(36).substr(2, 6), val, address: '0x7F' + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase() };
      const newNodes = [newNode, ...nodes];
      updateLinkedList(() => ({ nodes: newNodes, highlightId: newNode.id, unlinkingId: null }));
      logOp(`list.addFirst("${val}")`, 'O(1) [linkFirst]', '24B (Node Object)', before, JSON.stringify(newNodes.map(n => n.val)), 24, 'Low (Pointer Chasing)', 'Low (Wrapper Node)', `Updated first pointer: first = new Node<>(null, "${val}", oldFirst)`);
      setInputVal('');
    } else if (action === 'addLast') {
      const val = inputVal.trim() || `Tail-${nodes.length + 1}`;
      const newNode = { id: 'n_' + Math.random().toString(36).substr(2, 6), val, address: '0x7F' + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase() };
      const newNodes = [...nodes, newNode];
      updateLinkedList(() => ({ nodes: newNodes, highlightId: newNode.id, unlinkingId: null }));
      logOp(`list.addLast("${val}")`, 'O(1) [linkLast]', '24B (Node Object)', before, JSON.stringify(newNodes.map(n => n.val)), 24, 'Low (Pointer Chasing)', 'Low (Wrapper Node)', `Updated last pointer: last = new Node<>(oldLast, "${val}", null)`);
      setInputVal('');
    } else if (action === 'removeFirst') {
      if (nodes.length === 0) return;
      const rem = nodes[0];
      const newNodes = nodes.slice(1);
      updateLinkedList(() => ({ nodes: newNodes, unlinkingId: rem.id }));
      logOp('list.removeFirst()', 'O(1) [unlinkFirst]', 'O(1)', before, JSON.stringify(newNodes.map(n => n.val)), 0, 'Low (Pointer Chasing)', 'None (In-Place)', `Unlinked head node "${rem.val}" and nullified item/next pointers for GC`);
    } else if (action === 'removeLast') {
      if (nodes.length === 0) return;
      const rem = nodes[nodes.length - 1];
      const newNodes = nodes.slice(0, -1);
      updateLinkedList(() => ({ nodes: newNodes, unlinkingId: rem.id }));
      logOp('list.removeLast()', 'O(1) [unlinkLast]', 'O(1)', before, JSON.stringify(newNodes.map(n => n.val)), 0, 'Low (Pointer Chasing)', 'None (In-Place)', `Unlinked tail node "${rem.val}"`);
    } else if (action === 'peek') {
      if (nodes.length === 0) return;
      updateLinkedList(() => ({ highlightId: nodes[0].id }));
      logOp('list.peekFirst()', 'O(1)', 'O(1)', before, before, 0, 'Low (Pointer Chasing)', 'None (In-Place)', `Head item: "${nodes[0].val}"`);
    } else if (action === 'sort') {
      const newNodes = [...nodes].sort((a, b) => a.val.localeCompare(b.val));
      updateLinkedList(() => ({ nodes: newNodes, highlightId: null }));
      logOp('list.sort(naturalOrder())', 'O(n log n)', 'O(n) aux array', before, JSON.stringify(newNodes.map(n => n.val)), nodes.length * 4, 'Low (Pointer Chasing)', 'None (In-Place)', 'Dumped nodes to array, sorted via Timsort, rewrote values back via ListIterator');
    } else if (action === 'sample') {
      const samples = [
        { id: 'n1', val: 'Req-Ingest', address: '0x7F01A4' },
        { id: 'n2', val: 'Auth-Token', address: '0x7F02B8' },
        { id: 'n3', val: 'Rate-Limiter', address: '0x7F03C0' },
        { id: 'n4', val: 'Response-Sink', address: '0x7F04E2' }
      ];
      updateLinkedList(() => ({ nodes: samples, highlightId: null, unlinkingId: null }));
      logOp('list.addAll(samples)', 'O(k)', 'O(k)', before, JSON.stringify(samples.map(n => n.val)), 96, 'Low (Pointer Chasing)', 'Low (Wrapper Node)', 'Loaded sample Deque worker pipeline');
    } else if (action === 'clear') {
      updateLinkedList(() => ({ nodes: [], highlightId: null, unlinkingId: null }));
      logOp('list.clear()', 'O(n) [Pointer Unlink]', 'O(1)', before, '[]', 0, 'Low (Pointer Chasing)', 'None (In-Place)', 'Iterated through all nodes and set item, next, prev to null');
    }
  };

  // HASHSET ACTIONS
  const handleHashSet = (action: 'add' | 'remove' | 'contains' | 'clear' | 'sample') => {
    const { elements, capacity, buckets } = hashSetState;
    const before = JSON.stringify(elements);

    function computeHash(key: string) {
      let h = 0;
      for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
      const spreadHash = (h ^ (h >>> 16)) >>> 0;
      const bucketIndex = spreadHash & (capacity - 1);
      return { hash: h, spreadHash, bucketIndex };
    }

    if (action === 'add') {
      const key = inputVal.trim() || `TOKEN_${elements.length + 1}`;
      const exists = elements.includes(key);
      const { hash, spreadHash, bucketIndex } = computeHash(key);

      const newBuckets = buckets.map(b => ({ ...b, nodes: [...b.nodes] }));
      if (!exists) {
        newBuckets[bucketIndex].nodes.push({ key, hash, spreadHash });
        if (newBuckets[bucketIndex].nodes.length >= 8 && capacity >= 64) {
          newBuckets[bucketIndex].isTreeified = true;
        }
      }

      const newElements = exists ? elements : [...elements, key];
      updateHashSet(() => ({
        elements: newElements,
        buckets: newBuckets,
        activeCalculation: { key, hashCode: hash, spreadHash, bucketIndex, step: exists ? 'Duplicate Key Found -> Rejected' : 'Unique Key -> Appended to Bucket Bin' }
      }));

      logOp(
        `set.add("${key}")`,
        'O(1) Avg [Bitmask (n-1)&hash]',
        '32B (HashMap.Node)',
        before,
        JSON.stringify(newElements),
        exists ? 0 : 32,
        'Moderate',
        exists ? 'None (In-Place)' : 'Low (Wrapper Node)',
        exists ? `Returned false: "${key}" is already present` : `Returned true: Added "${key}" to bucket [${bucketIndex}]`,
        ['Computed 16-bit high-to-low bit-spread hash', `Calculated bucket index: (${capacity} - 1) & hash = ${bucketIndex}`, exists ? 'Matched existing key.equals()' : 'Instantiated new HashMap.Node']
      );
      setInputVal('');
    } else if (action === 'remove') {
      const key = inputVal.trim();
      if (!key) return;
      const { hash, spreadHash, bucketIndex } = computeHash(key);
      const exists = elements.includes(key);
      const newElements = elements.filter(k => k !== key);
      const newBuckets = buckets.map(b => ({
        ...b,
        nodes: b.nodes.filter(n => n.key !== key)
      }));

      updateHashSet(() => ({
        elements: newElements,
        buckets: newBuckets,
        activeCalculation: { key, hashCode: hash, spreadHash, bucketIndex, step: exists ? 'Unlinked Node from Bucket Bin' : 'Key Not Found in Bucket' }
      }));

      logOp(`set.remove("${key}")`, 'O(1) Avg', 'O(1)', before, JSON.stringify(newElements), 0, 'Moderate', 'None (In-Place)', `Returned ${exists}: Sliced node from bucket [${bucketIndex}]`);
      setInputVal('');
    } else if (action === 'contains') {
      const key = inputVal.trim();
      if (!key) return;
      const { hash, spreadHash, bucketIndex } = computeHash(key);
      const exists = elements.includes(key);

      updateHashSet(() => ({
        activeCalculation: { key, hashCode: hash, spreadHash, bucketIndex, step: exists ? 'Key Found in Bucket' : 'Key Absent from Bucket' }
      }));

      logOp(`set.contains("${key}")`, 'O(1) Avg', 'O(1)', before, before, 0, 'Moderate', 'None (In-Place)', `Membership query: ${exists} (Bucket [${bucketIndex}])`);
    } else if (action === 'sample') {
      const samples = ['JWT_ADMIN', 'SESSION_X92', 'API_KEY_LIVE', 'CACHE_V1', 'OAUTH_REFRESH'];
      const newBuckets: any[] = Array.from({ length: 16 }, (_, i) => ({ index: i, nodes: [], isTreeified: false }));
      samples.forEach(k => {
        const { hash, spreadHash, bucketIndex } = computeHash(k);
        newBuckets[bucketIndex].nodes.push({ key: k, hash, spreadHash });
      });
      updateHashSet(() => ({ elements: samples, buckets: newBuckets, activeCalculation: null }));
      logOp('set.addAll(tokens)', 'O(k)', 'O(k)', before, JSON.stringify(samples), samples.length * 32, 'Moderate', 'Low (Wrapper Node)', 'Loaded sample security tokens into hash buckets');
    } else if (action === 'clear') {
      const emptyBuckets = Array.from({ length: 16 }, (_, i) => ({ index: i, nodes: [], isTreeified: false }));
      updateHashSet(() => ({ elements: [], buckets: emptyBuckets, activeCalculation: null }));
      logOp('set.clear()', 'O(capacity)', 'O(1)', before, '[]', 0, 'Moderate', 'None (In-Place)', 'All table buckets reset to null');
    }
  };

  // TREESET ACTIONS
  const handleTreeSet = (action: 'add' | 'remove' | 'floor' | 'ceiling' | 'lower' | 'higher' | 'clear' | 'sample') => {
    const { keys } = treeSetState;
    const before = JSON.stringify(keys);
    const num = parseInt(inputVal) || Math.floor(Math.random() * 90 + 10);

    if (action === 'add') {
      const exists = keys.includes(num);
      const newKeys = exists ? keys : [...keys, num].sort((a, b) => a - b);
      const path: number[] = [];
      newKeys.forEach(k => { if (Math.abs(k - num) <= 25) path.push(k); });

      updateTreeSet(() => ({
        keys: newKeys,
        highlightPath: path,
        targetKey: num,
        rotationInfo: !exists && newKeys.length % 3 === 0 ? 'Restored Red-Black invariants (Left-Rotate + Color Flip)' : null,
        boundaryResult: null
      }));

      logOp(
        `treeSet.add(${num})`,
        'O(log n) [BST Descent & Rotations]',
        '40B (TreeMap.Entry)',
        before,
        JSON.stringify(newKeys),
        exists ? 0 : 40,
        'Low (Pointer Chasing)',
        exists ? 'None (In-Place)' : 'Low (Wrapper Node)',
        exists ? `Returned false: Duplicate key ${num} rejected (compare == 0)` : `Returned true: Inserted key ${num} into balanced BST`,
        ['Traversed binary search tree: left if < 0, right if > 0', 'Attached new RED node at leaf', 'Invoked fixAfterInsertion() restoring black-height balance']
      );
      setInputVal('');
    } else if (action === 'remove') {
      const exists = keys.includes(num);
      const newKeys = keys.filter(k => k !== num);
      updateTreeSet(() => ({
        keys: newKeys,
        highlightPath: [],
        targetKey: null,
        rotationInfo: null,
        boundaryResult: null
      }));
      logOp(`treeSet.remove(${num})`, 'O(log n)', 'O(1)', before, JSON.stringify(newKeys), 0, 'Low (Pointer Chasing)', 'None (In-Place)', `Removed key ${num}: Spliced node and restored balance`);
      setInputVal('');
    } else if (action === 'floor') {
      const fl = keys.filter(n => n <= num).pop();
      const path = keys.filter(n => n <= num);
      updateTreeSet(() => ({
        highlightPath: path,
        targetKey: fl !== undefined ? fl : null,
        boundaryResult: { label: `treeSet.floor(${num}) [Greatest <= ${num}]`, value: fl !== undefined ? fl : null }
      }));
      logOp(`treeSet.floor(${num})`, 'O(log n) [Navigable Boundary]', 'O(1)', before, before, 0, 'Low (Pointer Chasing)', 'None (In-Place)', `Greatest element <= ${num}: ${fl !== undefined ? fl : 'null'}`);
    } else if (action === 'ceiling') {
      const cl = keys.find(n => n >= num);
      const path = keys.filter(n => n >= num);
      updateTreeSet(() => ({
        highlightPath: path,
        targetKey: cl !== undefined ? cl : null,
        boundaryResult: { label: `treeSet.ceiling(${num}) [Least >= ${num}]`, value: cl !== undefined ? cl : null }
      }));
      logOp(`treeSet.ceiling(${num})`, 'O(log n)', 'O(1)', before, before, 0, 'Low (Pointer Chasing)', 'None (In-Place)', `Least element >= ${num}: ${cl !== undefined ? cl : 'null'}`);
    } else if (action === 'sample') {
      const samples = [15, 30, 45, 60, 75, 90, 105];
      updateTreeSet(() => ({ keys: samples, highlightPath: [], targetKey: null, rotationInfo: null, boundaryResult: null }));
      logOp('treeSet.addAll(samples)', 'O(k log n)', 'O(k)', before, JSON.stringify(samples), samples.length * 40, 'Low (Pointer Chasing)', 'Low (Wrapper Node)', 'Loaded balanced Red-Black tree range numbers');
    } else if (action === 'clear') {
      updateTreeSet(() => ({ keys: [], highlightPath: [], targetKey: null, rotationInfo: null, boundaryResult: null }));
      logOp('treeSet.clear()', 'O(n)', 'O(1)', before, '[]', 0, 'Low (Pointer Chasing)', 'None (In-Place)', 'TreeSet root set to null');
    }
  };

  // HASHMAP ACTIONS
  const handleHashMap = (action: 'put' | 'remove' | 'get' | 'clear' | 'sample') => {
    const { entries, capacity, buckets } = hashMapState;
    const before = JSON.stringify(entries);

    function computeHash(key: string) {
      let h = 0;
      for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
      const spreadHash = (h ^ (h >>> 16)) >>> 0;
      const bucketIndex = spreadHash & (capacity - 1);
      return { hash: h, spreadHash, bucketIndex };
    }

    if (action === 'put') {
      const key = inputKey.trim() || `KEY_${entries.length + 1}`;
      const val = parseInt(inputVal) || Math.floor(Math.random() * 500 + 10);
      const { hash, spreadHash, bucketIndex } = computeHash(key);

      const existingEntry = entries.find(e => e.key === key);
      const newEntries = existingEntry ? entries.map(e => e.key === key ? { key, value: val } : e) : [...entries, { key, value: val }];

      const newBuckets = buckets.map(b => ({ ...b, nodes: [...b.nodes] }));
      const bSlot = newBuckets[bucketIndex];
      const nodeIdx = bSlot.nodes.findIndex(n => n.key === key);
      if (nodeIdx !== -1) {
        bSlot.nodes[nodeIdx].val = val;
      } else {
        bSlot.nodes.push({ key, val, hash, spreadHash });
        if (bSlot.nodes.length >= 8 && capacity >= 64) {
          bSlot.isTreeified = true;
        }
      }

      updateHashMap(() => ({
        entries: newEntries,
        buckets: newBuckets,
        activeCalculation: { key, value: val, hashCode: hash, spreadHash, bucketIndex, step: existingEntry ? 'Updated Existing Key Value' : 'Created New Node<K,V> in Bucket' }
      }));

      logOp(
        `map.put("${key}", ${val})`,
        'O(1) Avg [Bitmask Table Slot]',
        '32B (Node<K,V>)',
        before,
        JSON.stringify(newEntries),
        existingEntry ? 0 : 32,
        'Moderate',
        existingEntry ? 'None (In-Place)' : 'Low (Wrapper Node)',
        existingEntry ? `Updated key "${key}" to ${val} (Old value: ${existingEntry.value})` : `Inserted new entry ("${key}" -> ${val}) in table[${bucketIndex}]`,
        ['Computed high-to-low bit-spread hash', `Calculated bucket index: (${capacity} - 1) & hash = ${bucketIndex}`, existingEntry ? 'Overwrote existing Node.value' : 'Appended Node at tail of bin']
      );
      setInputKey('');
      setInputVal('');
    } else if (action === 'remove') {
      const key = inputKey.trim() || inputVal.trim();
      if (!key) return;
      const { hash, spreadHash, bucketIndex } = computeHash(key);
      const target = entries.find(e => e.key === key);
      const newEntries = entries.filter(e => e.key !== key);
      const newBuckets = buckets.map(b => ({
        ...b,
        nodes: b.nodes.filter(n => n.key !== key)
      }));

      updateHashMap(() => ({
        entries: newEntries,
        buckets: newBuckets,
        activeCalculation: { key, hashCode: hash, spreadHash, bucketIndex, step: target ? 'Removed Node from Table' : 'Key Absent' }
      }));

      logOp(`map.remove("${key}")`, 'O(1) Avg', 'O(1)', before, JSON.stringify(newEntries), 0, 'Moderate', 'None (In-Place)', `Removed entry ("${key}" -> ${target ? target.value : 'null'})`);
      setInputKey('');
      setInputVal('');
    } else if (action === 'get') {
      const key = inputKey.trim() || inputVal.trim();
      if (!key) return;
      const { hash, spreadHash, bucketIndex } = computeHash(key);
      const target = entries.find(e => e.key === key);

      updateHashMap(() => ({
        activeCalculation: { key, hashCode: hash, spreadHash, bucketIndex, step: target ? `Value Found: ${target.value}` : 'Key Absent from Map' }
      }));

      logOp(`map.get("${key}")`, 'O(1) Avg', 'O(1)', before, before, 0, 'Moderate', 'None (In-Place)', `Value: ${target ? target.value : 'null'} (table[${bucketIndex}])`);
    } else if (action === 'sample') {
      const samples = [
        { key: 'AWS_CPU', value: 45 },
        { key: 'MEM_GB', value: 64 },
        { key: 'LATENCY_MS', value: 12 },
        { key: 'QPS_K', value: 180 },
        { key: 'THREAD_POOL', value: 32 }
      ];
      const newBuckets: any[] = Array.from({ length: 16 }, (_, i) => ({ index: i, nodes: [], isTreeified: false }));
      samples.forEach(s => {
        const { hash, spreadHash, bucketIndex } = computeHash(s.key);
        newBuckets[bucketIndex].nodes.push({ key: s.key, val: s.value, hash, spreadHash });
      });
      updateHashMap(() => ({ entries: samples, buckets: newBuckets, activeCalculation: null }));
      logOp('map.putAll(telemetry)', 'O(k)', 'O(k)', before, JSON.stringify(samples), samples.length * 32, 'Moderate', 'Low (Wrapper Node)', 'Loaded system telemetry metrics map');
    } else if (action === 'clear') {
      const emptyBuckets = Array.from({ length: 16 }, (_, i) => ({ index: i, nodes: [], isTreeified: false }));
      updateHashMap(() => ({ entries: [], buckets: emptyBuckets, activeCalculation: null }));
      logOp('map.clear()', 'O(capacity)', 'O(1)', before, '[]', 0, 'Moderate', 'None (In-Place)', 'All table buckets set to null');
    }
  };

  // STREAMS ACTIONS
  const handleStreams = (action: 'execute' | 'init' | 'sample' | 'clear') => {
    const { source } = streamsState;
    const before = JSON.stringify(source);

    if (action === 'execute') {
      // Build full pipeline
      const filtered = source.filter(n => n > filterThreshold);
      const mapped = filtered.map(n => n * mapFactor);
      const sorted = [...mapped].sort((a, b) => a - b);
      const toEmit = sorted;

      const newStages = [
        { id: 's1', name: 'Source: Arrays.stream()', type: 'source' as const, items: source },
        { id: 's2', name: `Filter: n > ${filterThreshold}`, type: 'filter' as const, items: filtered },
        { id: 's3', name: `Map: n * ${mapFactor}`, type: 'map' as const, items: mapped },
        { id: 's4', name: 'Terminal: .toList()', type: 'terminal' as const, items: toEmit }
      ];

      updateStreams(() => ({
        stages: newStages,
        isEvaluating: false,
        terminalResult: toEmit,
        shortCircuited: false
      }));

      logOp(
        `stream().filter(n -> n > ${filterThreshold}).map(n -> n * ${mapFactor}).sorted().toList()`,
        'O(n log n) [Single-Pass Fusion + Sort Barrier]',
        'O(k) Output List',
        before,
        JSON.stringify(toEmit),
        toEmit.length * 4 + 32,
        'High (L1/L2)',
        'Low (Wrapper Node)',
        `Pipeline completed: ${toEmit.length} items collected into List`,
        ['Constructed ReferencePipeline chain', 'Fused stateless filter and map sinks', 'Buffered in stateful sort barrier Sink', 'Collected into unmodifiable List via .toList()']
      );
    } else if (action === 'init') {
      const nums = (inputVal || '10, 25, 30, 45, 60, 85').split(/[,\\s]+/).map(Number).filter(n => !isNaN(n));
      updateStreams(() => ({
        source: nums,
        stages: [{ id: 's1', name: 'Source: Arrays.stream()', type: 'source', items: nums }],
        terminalResult: null
      }));
      logOp('Arrays.stream(nums)', 'O(1) [Spliterator Init]', 'O(1)', before, JSON.stringify(nums), 0, 'High (L1/L2)', 'None (In-Place)', `Initialized Stream source with ${nums.length} elements`);
      setInputVal('');
    } else if (action === 'sample') {
      const samples = [12, 45, 8, 88, 23, 67, 19, 54, 91, 33];
      updateStreams(() => ({
        source: samples,
        stages: [{ id: 's1', name: 'Source: Arrays.stream()', type: 'source', items: samples }],
        terminalResult: null
      }));
      logOp('Arrays.asList(samples).stream()', 'O(1)', 'O(1)', before, JSON.stringify(samples), 0, 'High (L1/L2)', 'None (In-Place)', 'Loaded 10 streaming telemetry metrics');
    } else if (action === 'clear') {
      updateStreams(() => ({ source: [], stages: [], terminalResult: null }));
      logOp('streamSource.clear()', 'O(1)', 'O(1)', before, '[]', 0, 'High (L1/L2)', 'None (In-Place)', 'Stream source emptied');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#131c31] rounded-xl border border-white/10 p-5 overflow-y-auto">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Interactive JVM Control Center</span>
        </div>

        {/* Action Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeTopic === 'ArrayList') handleArrayList('sample');
              else if (activeTopic === 'LinkedList') handleLinkedList('sample');
              else if (activeTopic === 'HashSet') handleHashSet('sample');
              else if (activeTopic === 'TreeSet') handleTreeSet('sample');
              else if (activeTopic === 'HashMap') handleHashMap('sample');
              else if (activeTopic === 'Streams') handleStreams('sample');
            }}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sample Stack</span>
          </button>
          <button
            onClick={() => {
              if (activeTopic === 'ArrayList') handleArrayList('clear');
              else if (activeTopic === 'LinkedList') handleLinkedList('clear');
              else if (activeTopic === 'HashSet') handleHashSet('clear');
              else if (activeTopic === 'TreeSet') handleTreeSet('clear');
              else if (activeTopic === 'HashMap') handleHashMap('clear');
              else if (activeTopic === 'Streams') handleStreams('clear');
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Dynamic Controls by Active Topic */}
      <div className="space-y-4 flex-1">
        {/* ARRAYLIST CONTROLS */}
        {activeTopic === 'ArrayList' && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Payload String Item:</label>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. Microservice-Auth"
                className="w-full px-3 py-2 rounded-lg bg-[#0b1120] border border-white/10 text-white text-sm font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Target Index (0 to {arrayListState.items.length}):</label>
              <input
                type="number"
                value={inputIdx}
                onChange={(e) => setInputIdx(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1120] border border-white/10 text-white text-sm font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleArrayList('add')}
                className="px-3 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/20"
              >
                <Plus className="w-3.5 h-3.5" /> add(item) [Append]
              </button>
              <button
                onClick={() => handleArrayList('insert')}
                className="px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold font-mono transition-all"
              >
                add(i, item) [Shift]
              </button>
              <button
                onClick={() => handleArrayList('removeIdx')}
                className="px-3 py-2.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> remove(index)
              </button>
              <button
                onClick={() => handleArrayList('get')}
                className="px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold font-mono transition-all"
              >
                get(index) [O(1)]
              </button>
              <button
                onClick={() => handleArrayList('sort')}
                className="col-span-2 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-bold font-mono transition-all"
              >
                list.sort(Timsort)
              </button>
            </div>
          </>
        )}

        {/* LINKEDLIST CONTROLS */}
        {activeTopic === 'LinkedList' && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Node Payload Item:</label>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. Ingest-Worker-01"
                className="w-full px-3 py-2 rounded-lg bg-[#0b1120] border border-white/10 text-white text-sm font-mono focus:border-violet-400 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleLinkedList('addFirst')}
                className="px-3 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> addFirst() [Head]
              </button>
              <button
                onClick={() => handleLinkedList('addLast')}
                className="px-3 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> addLast() [Tail]
              </button>
              <button
                onClick={() => handleLinkedList('removeFirst')}
                className="px-3 py-2.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono transition-all"
              >
                removeFirst()
              </button>
              <button
                onClick={() => handleLinkedList('removeLast')}
                className="px-3 py-2.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono transition-all"
              >
                removeLast()
              </button>
              <button
                onClick={() => handleLinkedList('peek')}
                className="px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold font-mono transition-all"
              >
                peekFirst()
              </button>
              <button
                onClick={() => handleLinkedList('sort')}
                className="px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-violet-300 text-xs font-bold font-mono transition-all"
              >
                Sort Nodes
              </button>
            </div>
          </>
        )}

        {/* HASHSET CONTROLS */}
        {activeTopic === 'HashSet' && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Element Key (Deduplication Check):</label>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. AUTH_BEARER_TOKEN"
                className="w-full px-3 py-2 rounded-lg bg-[#0b1120] border border-white/10 text-white text-sm font-mono focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleHashSet('add')}
                className="px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
              >
                <Plus className="w-3.5 h-3.5" /> set.add(key)
              </button>
              <button
                onClick={() => handleHashSet('remove')}
                className="px-3 py-2.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono transition-all"
              >
                set.remove(key)
              </button>
              <button
                onClick={() => handleHashSet('contains')}
                className="col-span-2 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold font-mono transition-all"
              >
                set.contains(key) [O(1) Avg]
              </button>
            </div>
          </>
        )}

        {/* TREESET CONTROLS */}
        {activeTopic === 'TreeSet' && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Numeric Key for BST Balance &amp; Queries:</label>
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-3 py-2 rounded-lg bg-[#0b1120] border border-white/10 text-white text-sm font-mono focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleTreeSet('add')}
                className="px-3 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20"
              >
                <Plus className="w-3.5 h-3.5" /> tree.add(x)
              </button>
              <button
                onClick={() => handleTreeSet('remove')}
                className="px-3 py-2.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono transition-all"
              >
                tree.remove(x)
              </button>
              <button
                onClick={() => handleTreeSet('floor')}
                className="px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold font-mono transition-all"
              >
                floor(x) [&le; x]
              </button>
              <button
                onClick={() => handleTreeSet('ceiling')}
                className="px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 text-xs font-bold font-mono transition-all"
              >
                ceiling(x) [&ge; x]
              </button>
            </div>
          </>
        )}

        {/* HASHMAP CONTROLS */}
        {activeTopic === 'HashMap' && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Map Key (String):</label>
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="e.g. AWS_REGION"
                className="w-full px-3 py-2 rounded-lg bg-[#0b1120] border border-white/10 text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Map Value (Integer):</label>
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. 42"
                className="w-full px-3 py-2 rounded-lg bg-[#0b1120] border border-white/10 text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleHashMap('put')}
                className="px-3 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/20"
              >
                <Plus className="w-3.5 h-3.5" /> map.put(K, V)
              </button>
              <button
                onClick={() => handleHashMap('remove')}
                className="px-3 py-2.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono transition-all"
              >
                map.remove(K)
              </button>
              <button
                onClick={() => handleHashMap('get')}
                className="col-span-2 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold font-mono transition-all"
              >
                map.get(K) [O(1) Avg]
              </button>
            </div>
          </>
        )}

        {/* STREAMS CONTROLS */}
        {activeTopic === 'Streams' && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Source Comma-Separated Numbers:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="10, 25, 30, 45, 60, 85"
                  className="flex-1 px-3 py-2 rounded-lg bg-[#0b1120] border border-white/10 text-white text-sm font-mono focus:border-indigo-400 focus:outline-none"
                />
                <button
                  onClick={() => handleStreams('init')}
                  className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono"
                >
                  Load
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Filter Predicate (n &gt; {filterThreshold}):</span>
                <span className="text-indigo-400 font-bold">{filterThreshold}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filterThreshold}
                onChange={(e) => setFilterThreshold(parseInt(e.target.value))}
                className="w-full accent-indigo-400"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Map Transform (n * {mapFactor}):</span>
                <span className="text-indigo-400 font-bold">{mapFactor}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={mapFactor}
                onChange={(e) => setMapFactor(parseInt(e.target.value))}
                className="w-full accent-indigo-400"
              />
            </div>
            <button
              onClick={() => handleStreams('execute')}
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Play className="w-4 h-4 fill-white" /> Trigger Terminal Pipeline Execution (.toList())
            </button>
          </>
        )}
      </div>
    </div>
  );
};

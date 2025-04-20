'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface MemoryEntry {
  label: string;
  value: string | number;
}

const D3ArrayVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [array, setArray] = useState<number[]>([30, 80, 45, 60, 20, 90, 50]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [memoryStack, setMemoryStack] = useState<MemoryEntry[]>([]);
  const [isSorting, setIsSorting] = useState(false);

  const isPausedRef = useRef<boolean>(false);
  const speedRef = useRef<number>(400);

  const width = 500;
  const height = 300;

  const delay = (ms: number) => {
    return new Promise<void>((resolve) => {
      const check = () => {
        if (!isPausedRef.current) {
          setTimeout(resolve, ms);
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  };

  const updateMemory = (i: number, j: number, arr: number[]) => {
    setMemoryStack([
      { label: 'i', value: i },
      { label: 'j', value: j },
      { label: 'arr[j]', value: arr[j] },
      { label: 'arr[j+1]', value: arr[j + 1] },
      { label: 'array', value: `[${arr.join(', ')}]` },
    ]);
  };

  const bubbleSort = async () => {
    setIsSorting(true);
    const arr = [...array];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setHighlightedIndex(j);
        updateMemory(i, j, arr);
        await delay(1000 - speedRef.current);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          updateMemory(i, j, arr);
        }

        setHighlightedIndex(j + 1);
        await delay(1000 - speedRef.current);
        setHighlightedIndex(null);
        await delay(100);
      }
    }

    setMemoryStack([]);
    setIsSorting(false);
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const barWidth = width / array.length;
    const maxVal = Math.max(...array);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxVal])
      .range([0, height - 50]);

    svg
      .selectAll('rect')
      .data(array)
      .enter()
      .append('rect')
      .attr('x', (_, i) => i * barWidth + 5)
      .attr('y', (d) => height - yScale(d))
      .attr('width', barWidth - 10)
      .attr('height', (d) => yScale(d))
      .attr('fill', (_, i) => (i === highlightedIndex ? 'orange' : 'steelblue'))
      .attr('rx', 4);

    svg
      .selectAll('text')
      .data(array)
      .enter()
      .append('text')
      .text((d) => d)
      .attr('x', (_, i) => i * barWidth + barWidth / 3)
      .attr('y', (d) => height - yScale(d) - 5)
      .attr('font-size', '12px');
  }, [array, highlightedIndex]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
      <div style={{ marginRight: '50px' }}>
        <h2 style={{ textAlign: 'center' }}>Bubble Sort</h2>
        <svg ref={svgRef} width={width} height={height} />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={bubbleSort}
            disabled={isSorting}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: isSorting ? 'not-allowed' : 'pointer',
              marginRight: '10px',
            }}
          >
            Start Sort
          </button>

          <button
            onClick={() => {
              isPausedRef.current = !isPausedRef.current;
            }}
            disabled={!isSorting}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: isPausedRef.current ? '#28a745' : '#ffc107',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: isSorting ? 'pointer' : 'not-allowed',
            }}
          >
            {isPausedRef.current ? 'Resume' : 'Pause'}
          </button>

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="speed">Speed: </label>
            <input
              type="range"
              id="speed"
              min="100"
              max="1000"
              step="100"
              defaultValue={500}
              onChange={(e) => (speedRef.current = Number(e.target.value))}
              style={{ width: '200px' }}
              disabled={!isSorting}
            />
            <span style={{ marginLeft: '10px' }}>{speedRef.current}ms</span>
          </div>
        </div>
      </div>

      <div
        style={{
          border: '2px solid #333',
          padding: '20px',
          borderRadius: '10px',
          width: '220px',
        }}
      >
        <h3 style={{ textAlign: 'center', paddingBottom: '10px' }}>🧠 Parameters</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {memoryStack.length > 0 ? (
            memoryStack.map((mem, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px',
                  border: '1px solid #666',
                  borderRadius: '6px',
                  background: '#f5f5f5',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                }}
              >
                <strong>{mem.label}:</strong> {mem.value}
              </div>
            ))
          ) : (
            <div style={{ color: '#999', textAlign: 'center' }}>Idle</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default D3ArrayVisualizer;

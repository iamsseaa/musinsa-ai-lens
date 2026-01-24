import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';

// fetch를 전역적으로 모킹
global.fetch = jest.fn();

describe('Home 컴포넌트', () => {
  beforeEach(() => {
    // 각 테스트 전에 fetch 모킹 초기화
    (global.fetch as jest.Mock).mockClear();
  });

  test('MUSINSA AI LENS 제목이 렌더링되는지 확인', () => {
    render(<Home />);
    const title = screen.getByText('MUSINSA AI LENS');
    expect(title).toBeInTheDocument();
  });

  test('이미지를 업로드하지 않았을 때 분석하기 버튼이 비활성화 상태인지 확인', () => {
    render(<Home />);
    const analyzeButton = screen.getByRole('button', { name: /AI 스타일 분석하기/i });
    expect(analyzeButton).toBeDisabled();
  });

  test('가상의 이미지 파일을 업로드했을 때 버튼이 활성화되는지 확인', async () => {
    const { container } = render(<Home />);
    
    // 파일 입력 요소 찾기
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    expect(fileInput).toBeInTheDocument();

    // 가상의 이미지 파일 생성
    const file = new File(['test-image'], 'test.png', { type: 'image/png' });
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    // FileReader 모킹
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      result: dataUrl,
      onloadend: null as (() => void) | null,
    };

    // FileReader 생성자 모킹
    global.FileReader = jest.fn(() => mockFileReader) as any;

    // 파일 업로드 시뮬레이션
    fireEvent.change(fileInput, { target: { files: [file] } });

    // FileReader의 readAsDataURL이 호출되었는지 확인
    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);

    // onloadend 콜백 시뮬레이션
    if (mockFileReader.onloadend) {
      mockFileReader.onloadend();
    }

    // 이미지가 로드되고 버튼이 활성화되는지 확인
    await waitFor(() => {
      const analyzeButton = screen.getByRole('button', { name: /AI 스타일 분석하기/i });
      expect(analyzeButton).not.toBeDisabled();
    });
  });

  test('이미지 업로드 후 분석하기 버튼 클릭 시 API 호출이 이루어지는지 확인', async () => {
    // API 응답 모킹
    const mockResponse = {
      style: '캐주얼',
      personalColor: '봄 웜톤',
      bodyType: '사각형',
      comment: '테스트 코멘트',
      searchKeywords: ['니트', '청바지'],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    const { container } = render(<Home />);

    // 파일 입력 요소 찾기
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    // 가상의 이미지 파일 생성
    const file = new File(['test-image'], 'test.png', { type: 'image/png' });
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    // FileReader 모킹
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      result: dataUrl,
      onloadend: null as (() => void) | null,
    };

    global.FileReader = jest.fn(() => mockFileReader) as any;

    // 파일 업로드
    fireEvent.change(fileInput, { target: { files: [file] } });

    if (mockFileReader.onloadend) {
      mockFileReader.onloadend();
    }

    // 버튼이 활성화될 때까지 대기
    await waitFor(() => {
      const analyzeButton = screen.getByRole('button', { name: /AI 스타일 분석하기/i });
      expect(analyzeButton).not.toBeDisabled();
    });

    // 분석하기 버튼 클릭
    const analyzeButton = screen.getByRole('button', { name: /AI 스타일 분석하기/i });
    fireEvent.click(analyzeButton);

    // API 호출 확인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      });
    });
  });
});

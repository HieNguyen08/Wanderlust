"""
Script to extract text from PDF files for algorithm analysis
"""

import sys
import os

try:
    import PyPDF2
except ImportError:
    print("Installing PyPDF2...")
    os.system(f"{sys.executable} -m pip install PyPDF2")
    import PyPDF2

def extract_text_from_pdf(pdf_path, output_path=None):
    """Extract text from PDF file"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            
            print(f"\nProcessing: {os.path.basename(pdf_path)}")
            print(f"Total pages: {num_pages}")
            
            text = ""
            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()
                text += f"\n\n--- Page {page_num + 1} ---\n\n"
                text += page_text
                
                if (page_num + 1) % 10 == 0:
                    print(f"Processed {page_num + 1}/{num_pages} pages...")
            
            # Save to file if output path provided
            if output_path:
                with open(output_path, 'w', encoding='utf-8') as out_file:
                    out_file.write(text)
                print(f"✓ Saved to: {output_path}")
            
            return text
            
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return None

def main():
    # Define PDF files
    pdf_files = [
        {
            'name': 'Paper 1: Smart Travel Planning',
            'path': '16-Smart-Travel-Planning-and-Recommendation-System.pdf',
            'output': 'extracted/paper1_smart_travel.txt'
        },
        {
            'name': 'Paper 2: PlusTour',
            'path': '2502.17345v2.pdf',
            'output': 'extracted/paper2_plustour.txt'
        }
    ]
    
    # Create output directory
    os.makedirs('extracted', exist_ok=True)
    
    print("="*80)
    print("PDF TEXT EXTRACTION FOR ALGORITHM COMPARISON")
    print("="*80)
    
    for pdf_info in pdf_files:
        pdf_path = pdf_info['path']
        
        if not os.path.exists(pdf_path):
            print(f"\n❌ File not found: {pdf_path}")
            continue
        
        print(f"\n{'='*80}")
        print(f"Extracting: {pdf_info['name']}")
        print(f"{'='*80}")
        
        text = extract_text_from_pdf(pdf_path, pdf_info['output'])
        
        if text:
            print(f"✓ Successfully extracted {len(text)} characters")
            
            # Print first 500 characters as preview
            print("\nPreview:")
            print("-" * 80)
            print(text[:500])
            print("-" * 80)
    
    print("\n" + "="*80)
    print("EXTRACTION COMPLETE")
    print("="*80)
    print("\nExtracted files saved in 'extracted/' folder")
    print("You can now analyze the content.")

if __name__ == "__main__":
    main()

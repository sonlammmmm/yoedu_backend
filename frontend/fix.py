import os
import re

def fix_imports_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace import { ... } from '...types/yoedu' with import type { ... }
    def repl(m):
        imports = m.group(1)
        module = m.group(0).split()[-1].strip("\"'")
        return f"import type {{{imports}}} from '{module}'"
        
    new_content = re.sub(
        r'import\s+\{([^}]+)\}\s+from\s+[\'\"].*(types/yoedu|types/api)[\'\"]',
        repl,
        content
    )
    
    # Fix double type
    new_content = new_content.replace('import type type', 'import type')

    # Fix modal paths
    if 'features/students/components' in filepath:
        new_content = new_content.replace('"../../components/ui/Modal"', '"../../../components/ui/Modal"')
        new_content = new_content.replace("'../../components/ui/Modal'", "'../../../components/ui/Modal'")

    # Fix getByClass -> getByClassId
    if 'features/enrollments/EnrollmentsPage' in filepath:
        new_content = new_content.replace('getByClass(', 'getByClassId(')
        new_content = new_content.replace('getByStudent(', 'getByStudentId(')
        # Fix courseName in EnrollmentsPage
        new_content = new_content.replace('t.courseName', 't.classId') 
        
    if 'features/attendance/AttendancePage' in filepath:
        new_content = new_content.replace('getByClass(', 'getByClassId(')
        
    if 'features/billing/BillingPage' in filepath:
        new_content = new_content.replace('getInvoicesByStudent(', 'getInvoicesByStudentId(')

    # Fix any in onError
    new_content = new_content.replace('(err: any)', '(err: Error)')

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Fixed {filepath}')

for root, _, files in os.walk('e:/yoedu_backend/frontend/src'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            fix_imports_in_file(os.path.join(root, file))
